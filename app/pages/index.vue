<script setup lang="ts">
import { useProjectsStore } from "~/stores/projects";
import { useTasksStore } from "~/stores/tasks";

const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();

const isCreateModalShown = ref(false);
const filter = ref("");

const toggleIsCreateModalShown = () => {
  isCreateModalShown.value = !isCreateModalShown.value;
};

const refreshProjects = async () => {
  const res = await projectsStore.getProjectsList();
  if (res) projectsStore.filteredProjects = projectsStore.projects;
};

if (process.client && history.state.project === "deleted") {
  // toast.success("Проект видалено!", { autoClose: 2000 });
  history.replaceState({}, "");
}

if (process.client && history.state.project === "was deleted") {
  // toast.error("Проект було видалено!", { autoClose: 2000 });
  history.replaceState({}, "");
}

watch(
  filter,
  () =>
    (projectsStore.filteredProjects = projectsStore.projects.filter((item) =>
      item.title.includes(filter.value)
    ))
);

onMounted(async () => {
  await projectsStore.getProjectsList();
  projectsStore.setCurrentProjectId(null);
  await tasksStore.getAllTasks();
  projectsStore.filteredProjects = projectsStore.projects;
});
</script>

<template>
  <div class="page">
    <div class="controls">
      <p>{{ isCreateModalShown }}</p>
      <UButton label="Створити проект" @click="toggleIsCreateModalShown" />

      <UInput id="filter" v-model="filter" placeholder="Фільтр" />
    </div>

    <ProjectsTable v-if="projectsStore.filteredProjects.length > 0" />

    <h2
      v-if="
        projectsStore.filteredProjects.length === 0 &&
        !projectsStore.isLoadingProjects
      "
      class="title"
    >
      Немає проектів
    </h2>

    <SharedSpinner v-if="projectsStore.isLoadingProjects" />

    <UModal v-model:open="isCreateModalShown" title="Створити проект">
      <UButton label="Створити проект" color="neutral" variant="subtle" />
      <template #body>
        <ProjectCreateForm
          :toggleIsCreateModalShown
          @projectCreated="refreshProjects"
        />
      </template>
    </UModal>
  </div>
</template>

<style scoped lang="css">
.page {
  .controls {
    align-items: center;
    justify-content: flex-start;
    display: flex;
    margin-bottom: 20px;
    gap: 20px;
  }

  .filter-input {
    width: 200px;
  }

  .heading {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
  }
}
</style>
