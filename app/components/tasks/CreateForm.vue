<script setup lang="ts">
import { ref } from "vue";
import { createTask, updateProject } from "@/api/api";
import { assignees } from "@/assets/assignees";
import { vMaska } from "maska/vue";
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { UButton } from "#components";

const props = defineProps<{
  toggleCreateModal: () => void;
  project: Project;
}>();

const emit = defineEmits(["taskCreated"]);

const schema = z.object({
  title: z.string().min(8, "Must be at least 8 characters"),
  description: z.string().min(8, "Must be at least 8 characters"),
  assignee: z.string().min(1, "Must be at least 8 characters"),
  maskedDeadline: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  title: undefined,
  description: undefined,
  assignee: undefined,
  maskedDeadline: undefined,
});

const unmaskedDeadline = ref("");
const isLoading = ref(false);

const toast = useToast();

const upDateProjectTasks = async (updatedProject: Project, taskId: string) => {
  try {
    await updateProject(updatedProject, props.project.id);

    emit("taskCreated", taskId);
    props.toggleCreateModal();
    toast.add({ title: "Завдання створено!", color: "success" });
  } catch (e) {
    console.log(e);
    // router.push({ path: "/", state: { project: "was deleted" } });
  }
};

const createNewTask = async (event: FormSubmitEvent<Schema>) => {
  isLoading.value = true;
  const task: TaskDto = {
    title: event.data.title,
    assignee: event.data.assignee,
    deadline: event.data.maskedDeadline,
    status: "todo",
    projectId: props.project.id,
  };
  try {
    const res = await createTask(task);
    if (res && props.project) {
      const updatedProject = {
        ...props.project,
        tasks: [...props.project.tasks, res.id],
      };
      await upDateProjectTasks(updatedProject, res.id);
    }
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
};

defineExpose({ unmaskedDeadline });
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="createNewTask"
  >
    <UFormField label="Назва завдання" name="title">
      <UInput v-model="state.title" placeholder="Введіть назву завдання" />
    </UFormField>

    <UFormField label="Опис завданняя" name="description">
      <UInput v-model="state.description" placeholder="Введіть опис проекту" />
    </UFormField>

    <UFormField label="Вибір виконавця:" name="assignee">
      <USelect
        v-model="state.assignee"
        placeholder="Оберіть зі списку"
        :items="assignees"
        class="w-48"
      />
    </UFormField>

    <UFormField label="Опис завданняя" name="maskedDeadline">
      <UInput
        v-model="state.maskedDeadline"
        v-maska:unmaskedDeadline.unmasked="'####-##-##'"
        placeholder="РРРР-ММ-ДД"
      />
    </UFormField>

    <UButton :loading="isLoading" type="submit">Створити</UButton>
  </UForm>
</template>

<style scoped lang="css">
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
  max-width: 400px;
}
</style>
