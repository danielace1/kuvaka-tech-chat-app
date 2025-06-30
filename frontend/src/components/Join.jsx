import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
});

const Join = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Handle form submission
  // Redirect to chat page with username
  const onSubmit = (data) => {
    navigate("/chat", { state: { username: data.username } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6">
        <h1 className="text-3xl font-bold text-center mb-5 text-blue-600">
          💬 Join the Chat Room
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              {...register("username")}
              placeholder="Enter your username"
              className={`w-full px-4 py-2 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:border focus:border-blue-400`}
            />
            {errors.username && (
              <span className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition cursor-pointer"
          >
            Enter Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default Join;
