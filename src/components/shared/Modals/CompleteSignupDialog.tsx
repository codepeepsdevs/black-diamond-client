import * as Dialog from "@radix-ui/react-dialog";
import { ComponentProps } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

export default function CompleteSignupDialog({
  email,
  ...props
}: ComponentProps<typeof Dialog.Root> & {
  email: string;
}) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-50 backdrop-blur-sm fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <Dialog.Content className="relative bg-[#333333] text-[#A3A7AA] p-6 mx-auto py-9 max-w-lg">
            <div className="flex justify-end items-end mb-4 sm:mb-6">
              <Dialog.Close>
                <IoMdClose className="text-white text-3xl cursor-pointer" />
              </Dialog.Close>
            </div>

            <div className="bg-[#444444] text-white size-24 mx-auto rounded-full grid place-items-center">
              <MdOutlineEmail className="text-4xl" />
            </div>

            <h2 className="text-white text-2xl lg:text-4xl font-medium text-center mt-8 sm:mt-12">
              Please complete your account signup
            </h2>

            <div className="flex flex-col justify-center items-center gap-2 sm:gap-3 mt-6">
              <p className="text-[#C0C0C0] text-sm sm:text-base text-center lg:text-xl">
                Please complete your signup process by resetting your account
                password using the link sent in your mailbox for {email}
              </p>
              <p className="text-[#C0C0C0] text-sm sm:text-base text-center lg:text-xl">
                For your security, the link expires in 2 hours.
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
