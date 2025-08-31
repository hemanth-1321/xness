"use client";

import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Form, FormControl, FormField, FormItem } from "@workspace/ui/components/form";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/config";

// Zod schema
const authSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type AuthFormValues = z.infer<typeof authSchema>;

export const AuthForm = () => {
  const [type, setType] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const setToken = useUserStore((state) => state.setToken);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: AuthFormValues) => {
    setLoading(true);

    // 👇 ensures loading state stays visible for at least 300ms
    const minDelay = new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const res = await axios.post(`${BACKEND_URL}/user/${type}`, values);

      if (type === "signin") {
        setToken(res.data.token);
        toast("Sign in successful");
      } else {
        toast("Sign Up Success! Please Sign In.");
        setType("signin");
        form.reset();
      }
    } catch (err: any) {
      toast(err.response?.data?.error || "Error");
    } finally {
      await minDelay; // wait for at least 300ms before removing loading state
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 border rounded-md w-96"
      >
        <h2 className="text-lg font-bold text-center">
          {type === "signup" ? "Sign Up" : "Sign In"}
        </h2>

        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <Label>Email</Label>
              <FormControl>
                <Input {...field} placeholder="your@email.com" />
              </FormControl>
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <Label>Password</Label>
              <FormControl>
                <Input type="password" {...field} placeholder="********" />
              </FormControl>
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : type === "signup" ? "Sign Up" : "Sign In"}
        </Button>

        <div className="text-center mt-2">
          {type === "signin" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setType("signup")}
                className="text-blue-500 underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setType("signin")}
                className="text-blue-500 underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};
