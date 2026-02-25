import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ApiError, type ProblemDetails, type UserDto, UserService } from "../api";
import { getAppToken } from "../helpers/TokenProvider";
import { Loader } from "./Loader";

const loginSchema = z.object({
  login: z.string().min(1, "Username is required"),
  secret: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  login: z.string().min(1, "Username (TeamSpeakID) is required"),
  secret: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

type LoginProps = {
  onLogin: ({ login, secret }: UserDto) => void;
};

export const Login = ({ onLogin }: LoginProps) => {
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getAppToken();
  }, []);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", secret: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { login: "", secret: "" },
  });

  const handleLogin = (values: LoginFormValues) => {
    onLogin({ login: values.login, secret: values.secret });
  };

  const handleRegistration = async (values: RegisterFormValues) => {
    setIsLoading(true);
    await UserService.postApiV1Users(values)
      .then(() => {
        setIsLoading(false);
        setIsRegisterOpen(false);
        onLogin(values);
      })
      .catch((onRejected) => {
        setIsLoading(false);
        const error = onRejected as ApiError;
        const body = JSON.parse(error.body) as ProblemDetails;
        toast.error(`Failed to register: ${body.detail}`);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  Login
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsRegisterOpen(true)}>
                  Register
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create account</DialogTitle>
          </DialogHeader>
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(handleRegistration)} className="space-y-4">
              <FormField
                control={registerForm.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Login (your TeamSpeakID)</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isLoading}>
                  Register
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Loader />
        </div>
      )}
    </div>
  );
};
