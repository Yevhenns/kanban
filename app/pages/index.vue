<script setup lang="ts">
const toast = useToast();

const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();

const isCreateModalShown = ref(false);
const filter = ref("");

const toggleCreateModal = () => {
  isCreateModalShown.value = !isCreateModalShown.value;
};

const refreshProjects = async () => {
  const res = await projectsStore.getProjectsList();
  if (res) projectsStore.filteredProjects = projectsStore.projects;
};

if (import.meta.client && history.state.project === "deleted") {
  toast.add({ title: "Проект видалено!", color: "success" });
  history.replaceState({}, "");
}

if (import.meta.client && history.state.project === "was deleted") {
  toast.add({ title: "Проект було видалено!", color: "error" });
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
  <UContainer class="py-4">
    <div class="page">
      <div class="controls">
        <UButton label="Створити проект" @click="toggleCreateModal" />
        <UInput
          id="filter"
          v-model="filter"
          placeholder="Фільтр"
          aria-label="filter"
        />
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

      <UModal
        v-model:open="projectsStore.isLoadingProjects"
        :close="false"
        title="Завантаження проектів"
      >
        <template #description>
          <span class="sr-only">Завантаження проектів</span>
        </template>
        <template #body>
          <UProgress animation="swing" />
        </template>
      </UModal>

      <UModal v-model:open="isCreateModalShown" title="Створити проект">
        <template #description>
          <span class="sr-only">Створити проект</span>
        </template>
        <template #body>
          <ProjectsCreateForm
            :toggle-create-modal="toggleCreateModal"
            @project-created="refreshProjects"
          />
        </template>
      </UModal>
    </div>
  </UContainer>
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
