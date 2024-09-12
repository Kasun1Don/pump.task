"use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { z, ZodTypeDef } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@acme/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   useForm,
// } from "@acme/ui/form";
import { Input } from "@acme/ui/input";

export default function NewUser() {
  const router = useRouter();
  return (
    <div className="container flex h-screen max-w-5xl flex-col items-center gap-5 py-16 text-center">
      <h1>Welcome</h1>
      <h2>What should we call you?</h2>
      <Input className="w-64 text-center" />
      <Button onClick={() => router.push("/dashboard")}>Submit</Button>
    </div>
  );
}

// const userSchema = z.object({
//     name: z.string().min(2, 'Name must be at least 2 characters'),
//     age: z.number().min(18, 'Must be 18 or older'),
//     email: z.string().email('Invalid email address'),
//     isAdmin: z.boolean().optional(),
//   });

//   // Define the input type and output type based on your schema
//   type UserInput = z.input<typeof userSchema>; // Before validation
//   type UserOutput = z.output<typeof userSchema>;

// const formSchema = z.object({
//     name: z.string().min(2, 'Name must be at least 2 characters'),
//     // email: z.string().email('Invalid email address'),
//   });

// type FormData = z.infer<typeof formSchema>;

// export default function NewUser() {
//     const { register, handleSubmit, formState: { errors } } = useForm<UserOutput, ZodTypeDef, UserInput>({
//         schema: userSchema,
//         defaultValues: {
//           name: '',
//           age: 18,
//           email: '',
//           isAdmin: false,
//         },
//         mode: 'onSubmit', // Validation mode
//       });

//       const onSubmit = (data: FormData) => {
//         console.log(data);
//       };

//       return (
//         <Form>
//           {/* Name field */}
//             <FormItem>
//               <FormLabel>What should we call you?</FormLabel>
//               <FormControl>
//                 <Input placeholder="Your name" {...register('name')} />
//               </FormControl>
//               {/* {errors.name && <FormMessage>{errors.name.message}</FormMessage>} */}
//             </FormItem>
//          </Form>
//   }
