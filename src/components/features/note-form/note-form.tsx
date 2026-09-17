import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitEvent, useCallback } from "react";
import { useForm } from "react-hook-form";
import { type NoteDraft, noteDraftSchema } from "@/entities/note";
import { notesQueryOptions } from "@/gateways/note/read";
import { createNote } from "@/gateways/note/write";

export const NoteForm = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteDraft>({
    resolver: zodResolver(noteDraftSchema),
    defaultValues: { title: "", body: "" },
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      reset();
      await queryClient.invalidateQueries(notesQueryOptions());
    },
  });

  // `handleSubmit` and `mutate` keep their identity across renders, so this
  // handler does too, and the form element receives the same prop each time.
  const submit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      void handleSubmit((draft) => {
        mutate(draft);
      })(event);
    },
    [handleSubmit, mutate],
  );

  return (
    <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">タイトル</span>
        <input
          {...register("title")}
          aria-invalid={errors.title !== undefined}
          className="rounded-md border border-input px-3 py-2 text-base"
        />
      </label>
      {errors.title !== undefined && (
        <p role="alert" className="text-sm text-destructive">
          {errors.title.message}
        </p>
      )}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">本文</span>
        <textarea
          {...register("body")}
          rows={3}
          className="rounded-md border border-input px-3 py-2 text-base"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {isPending ? "追加中" : "追加する"}
      </button>
      {isError && (
        <p role="alert" className="text-sm text-destructive">
          追加できませんでした。時間をおいて試してください。
        </p>
      )}
    </form>
  );
};
