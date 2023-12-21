"use client";

import { register } from "@/lib/server/actions/auth.actions";
import Link from "next/link";
import { useFormState } from "react-dom";

export default function RegisterForm() {
  const [state, formAction] = useFormState(register, null);

  return (
    <form
      action={formAction}
      className="w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white p-8 rounded shadow-md"
    >
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full block text-center"
      >
        Register
      </button>

      {state && (
        <div className="py-4 text-red-500 rounded-lg font-semibold italic">
          {state.error}
        </div>
      )}

      <div className="mt-4 text-center">
        <p>{`Have an account?`}</p>
        <Link href="/login" className="text-blue-500 underline">
          Login here
        </Link>
      </div>
    </form>
  );
}
