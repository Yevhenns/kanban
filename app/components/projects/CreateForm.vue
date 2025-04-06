<script setup lang="ts">
import { ref } from "vue";
import { createProject } from "@/api/api";
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const props = defineProps<{
  toggleCreateModal: () => void;
}>();

const emit = defineEmits(["projectCreated"]);

const schema = z.object({
  title: z.string().min(8, "Must be at least 8 characters"),
  description: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  title: undefined,
  description: undefined,
});

const isLoading = ref(false);

const toast = useToast();

const createNewProject = async (event: FormSubmitEvent<Schema>) => {
  isLoading.value = true;
  const project: ProjectDto = {
    title: event.data.title,
    description: event.data.description || "",
    createdAt: new Date().toISOString().split("T")[0] || "",
    status: "todo",
    tasks: [],
  };
  try {
    const res = await createProject(project);
    if (res) {
      emit("projectCreated");
      props.toggleCreateModal();
    }
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  } finally {
    isLoading.value = false;
    toast.add({ title: "Проект створено!", color: "success" });
  }
};
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="createNewProject"
  >
    <UFormField label="Назва проекту" name="title">
      <UInput
        v-model="state.title"
        placeholder="Введіть назву проекту"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Опис проекту" name="description">
      <UInput
        v-model="state.description"
        placeholder="Введіть опис проекту"
        class="w-full"
      />
    </UFormField>

    <UButton
      :loading="isLoading"
      type="submit"
      class="w-full text-center flex justify-center items-center"
    >
      Створити
    </UButton>
  </UForm>
</template>
