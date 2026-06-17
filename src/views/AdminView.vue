<template>
  <div class="min-h-screen bg-surface">
    <div v-if="!authenticated" class="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div class="w-full max-w-md p-8 bg-surface-light rounded-xl border border-white/5">
        <h1 class="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <form @submit.prevent="login">
          <input
            v-model="passwordInput"
            type="password"
            placeholder="Enter password"
            class="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors mb-4"
          />
          <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>
          <button
            type="submit"
            class="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg text-white font-medium transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>

    <div v-else class="max-w-6xl mx-auto px-6 py-20">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold">Admin Dashboard</h1>
        <div class="flex gap-3">
          <button
            @click="exportData"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
          >
            Export JSON
          </button>
          <label class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors cursor-pointer">
            Import JSON
            <input type="file" accept=".json" @change="importData" class="hidden" />
          </label>
          <button
            @click="resetData"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        <div class="space-y-6">
          <section class="p-6 bg-surface-light rounded-xl border border-white/5">
            <h2 class="text-xl font-semibold mb-4">Profile</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-text-secondary mb-1">Name (中文)</label>
                <input v-model="data.profile.name.zh" class="input-field" />
              </div>
              <div>
                <label class="block text-sm text-text-secondary mb-1">Name (English)</label>
                <input v-model="data.profile.name.en" class="input-field" />
              </div>
              <div>
                <label class="block text-sm text-text-secondary mb-1">Title (中文)</label>
                <input v-model="data.profile.title.zh" class="input-field" />
              </div>
              <div>
                <label class="block text-sm text-text-secondary mb-1">Title (English)</label>
                <input v-model="data.profile.title.en" class="input-field" />
              </div>
              <div>
                <label class="block text-sm text-text-secondary mb-1">Description (中文)</label>
                <textarea v-model="data.profile.description.zh" rows="2" class="input-field"></textarea>
              </div>
              <div>
                <label class="block text-sm text-text-secondary mb-1">Description (English)</label>
                <textarea v-model="data.profile.description.en" rows="2" class="input-field"></textarea>
              </div>
              <div>
                <label class="block text-sm text-text-secondary mb-1">Avatar URL</label>
                <input v-model="data.profile.avatar" class="input-field" placeholder="https://..." />
              </div>
            </div>
          </section>

          <section class="p-6 bg-surface-light rounded-xl border border-white/5">
            <h2 class="text-xl font-semibold mb-4">Social Links</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-text-secondary mb-1">GitHub</label>
                <input v-model="data.social.github" class="input-field" />
              </div>
              <div>
                <label class="block text-sm text-text-secondary mb-1">Twitter</label>
                <input v-model="data.social.twitter" class="input-field" />
              </div>
              <div>
                <label class="block text-sm text-text-secondary mb-1">Email</label>
                <input v-model="data.social.email" class="input-field" />
              </div>
            </div>
          </section>
        </div>

        <div class="space-y-6">
          <section class="p-6 bg-surface-light rounded-xl border border-white/5">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold">Skills</h2>
              <button @click="addSkill" class="text-sm text-primary hover:underline">+ Add</button>
            </div>
            <div class="space-y-2">
              <div v-for="(skill, i) in data.about.skills" :key="i" class="flex gap-2">
                <input v-model="data.about.skills[i]" class="input-field flex-1" />
                <button @click="removeSkill(i)" class="px-3 text-red-500 hover:text-red-400">×</button>
              </div>
            </div>
          </section>

          <section class="p-6 bg-surface-light rounded-xl border border-white/5">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold">Experiences</h2>
              <button @click="addExperience" class="text-sm text-primary hover:underline">+ Add</button>
            </div>
            <div class="space-y-4">
              <div v-for="(exp, i) in data.about.experiences" :key="i" class="p-4 bg-surface rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <input v-model="exp.title" class="input-field flex-1 mr-2" placeholder="Title" />
                  <button @click="removeExperience(i)" class="text-red-500 hover:text-red-400">×</button>
                </div>
                <input v-model="exp.company" class="input-field w-full mb-2" placeholder="Company · Year" />
                <input v-model="exp.description.zh" class="input-field w-full mb-1" placeholder="Description (中文)" />
                <input v-model="exp.description.en" class="input-field w-full" placeholder="Description (English)" />
              </div>
            </div>
          </section>

          <section class="p-6 bg-surface-light rounded-xl border border-white/5">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold">Projects</h2>
              <button @click="addProject" class="text-sm text-primary hover:underline">+ Add</button>
            </div>
            <div class="space-y-4">
              <div v-for="(proj, i) in data.projects" :key="i" class="p-4 bg-surface rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <input v-model="proj.title" class="input-field flex-1 mr-2" placeholder="Title" />
                  <button @click="removeProject(i)" class="text-red-500 hover:text-red-400">×</button>
                </div>
                <input v-model="proj.icon" class="input-field w-full mb-2" placeholder="Icon emoji" />
                <input v-model="proj.description.zh" class="input-field w-full mb-1" placeholder="Description (中文)" />
                <input v-model="proj.description.en" class="input-field w-full mb-2" placeholder="Description (English)" />
                <input v-model="proj.tags" class="input-field w-full mb-2" placeholder="Tags (comma separated)" />
                <div class="grid grid-cols-2 gap-2">
                  <input v-model="proj.url" class="input-field" placeholder="Project URL" />
                  <input v-model="proj.code" class="input-field" placeholder="Code URL" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div class="mt-8 flex justify-center">
        <button
          @click="save"
          class="px-8 py-3 bg-primary hover:bg-primary-dark rounded-lg font-medium transition-colors"
        >
          Save Changes
        </button>
      </div>

      <p v-if="saved" class="text-center text-green-500 mt-4">Saved successfully!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { verifyPassword, getProfile, saveProfile, resetProfile, exportProfile, importProfile } from '../utils/profile.js'

const authenticated = ref(false)
const passwordInput = ref('')
const error = ref('')
const saved = ref(false)

const data = reactive({
  profile: { name: { zh: '', en: '' }, title: { zh: '', en: '' }, description: { zh: '', en: '' }, avatar: '' },
  about: { bio: { zh: '', en: '' }, skills: [], experiences: [] },
  projects: [],
  social: { github: '', twitter: '', email: '' },
  gallery: [],
})

onMounted(() => {
  Object.assign(data, getProfile())
})

function login() {
  if (verifyPassword(passwordInput.value)) {
    authenticated.value = true
    error.value = ''
  } else {
    error.value = 'Wrong password'
  }
}

function save() {
  const tagsData = data.projects.map(p => ({
    ...p,
    tags: Array.isArray(p.tags) ? p.tags : p.tags.split(',').map(t => t.trim()).filter(Boolean)
  }))
  saveProfile({ ...data, projects: tagsData })
  saved.value = true
  setTimeout(() => saved.value = false, 2000)
}

function addSkill() {
  data.about.skills.push('New Skill')
}

function removeSkill(i) {
  data.about.skills.splice(i, 1)
}

function addExperience() {
  data.about.experiences.push({
    title: 'New Position',
    company: 'Company · Year',
    description: { zh: '', en: '' }
  })
}

function removeExperience(i) {
  data.about.experiences.splice(i, 1)
}

function addProject() {
  data.projects.push({
    title: 'New Project',
    description: { zh: '', en: '' },
    icon: '📦',
    tags: [],
    url: '#',
    code: '#'
  })
}

function removeProject(i) {
  data.projects.splice(i, 1)
}

function exportData() {
  exportProfile()
}

async function importData(e) {
  const file = e.target.files[0]
  if (file) {
    try {
      const newData = await importProfile(file)
      Object.assign(data, newData)
    } catch (err) {
      alert('Invalid JSON file')
    }
  }
}

function resetData() {
  if (confirm('Reset all data to default?')) {
    Object.assign(data, resetProfile())
  }
}
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
}
</style>
