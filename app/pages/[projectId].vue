<script setup lang="ts">
import { deleteProjectById } from "@/api/api";

import { onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();

const router = useRouter();

const createModalShown = ref(false);

const toggleCreateModal = () => {
  createModalShown.value = !createModalShown.value;
};

const refreshTasks = async () => {
  try {
    const response = await projectsStore.getProjectsList();
    if (response) {
      await tasksStore.getAllTasks();
    }
  } catch (e) {
    console.log(e);
  }
};

const deleteProject = async () => {
  if (projectsStore.currentProject) {
    try {
      await deleteProjectById(projectsStore.currentProject?.id);
    } catch (e) {
      console.log(e);
    } finally {
      router.push({ path: "/", state: { project: "deleted" } });
    }
  }
};

onMounted(async () => {
  await projectsStore.getProjectsList();
  await tasksStore.getAllTasks();
  if (projectsStore.currentProjectId && !projectsStore.currentProject) {
    projectsStore.setCurrentProjectId(null);
  }
});

watchEffect(() => {
  if (!projectsStore.currentProjectId) router.push("/");
});
</script>

<template>
  <UContainer class="py-4">
    <div>
      <div class="project-info">
        <h1>Сторінка проекту "{{ projectsStore.currentProject?.title }}"</h1>
        <p>ID: {{ projectsStore.currentProject?.id }}</p>
        <p>Опис: {{ projectsStore.currentProject?.description }}</p>
        <p>Статус: {{ projectsStore.currentProject?.status }}</p>
        <p>Створено: {{ projectsStore.currentProject?.createdAt }}</p>
      </div>

      <div class="project-actions">
        <!-- <UButton type="button" @click="toggleIsCreateModalShown">
        Створити завдання
      </UButton> -->
        <UButton @click="deleteProject"> Видалити проект </UButton>
      </div>

      <UModal
        v-if="projectsStore.currentProject"
        v-model:open="createModalShown"
        title="Створити проект"
      >
        <template #description>
          <span class="sr-only">Створити проект</span>
        </template>
        <template #body>
          <TasksCreateForm
            :toggle-create-modal="toggleCreateModal"
            :project="projectsStore.currentProject"
            @project-created="refreshTasks"
          />
        </template>
      </UModal>

      <TasksColumns :toggle-create-modal="toggleCreateModal" />

      <UModal
        v-model:open="tasksStore.isLoadingTasks"
        :close="false"
        title="Завантаження завдань"
      >
        <template #description>
          <span class="sr-only">Завантаження завдань</span>
        </template>
        <template #body>
          <UProgress animation="swing" />
        </template>
      </UModal>
    </div>
  </UContainer>
</template>

<style scoped lang="css">
.project-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.project-info {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;

  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
  }

  p {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
  }

  strong {
    font-weight: bold;
  }
}

.project-actions {
  display: flex;
  gap: 20px;
  justify-content: flex-start;
}
</style>
