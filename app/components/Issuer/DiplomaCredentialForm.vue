<template>
  <form v-if="fillingForm" @submit.prevent="onSubmit" autocomplete="off">
    <section class="space-y-8">
      <header class="pb-6 border-b border-gray-200">
        <h2 class="text-base font-semibold text-gray-900">
          Credential Information
        </h2>
        <p class="mt-1 text-sm text-gray-600">
          This credential is verifiable credential issued by C4DT.
          <br />
          Disclaimer: This is a toy credential for the C4DT hands-on workshop on E-ID.
        </p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-8">
        <div class="sm:col-span-4">
          <label for="signee" class="block text-sm font-medium text-gray-900">
            Name
          </label>
          <div class="mt-2">
            <input
              v-model="model.signee"
              id="signee"
              name="signee"
              type="text"
              autocomplete="off"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label
            for="documentNumber"
            class="block text-sm font-medium text-gray-900"
            >Document Number</label
          >
          <div class="mt-2">
            <input
              v-model="model.documentNumber"
              id="documentNumber"
              name="documentNumber"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
          </div>
        </div>
        <div class="sm:col-span-3">
          <label for="subject" class="block text-sm font-medium text-gray-900"
            >Subject</label
          >
          <div class="mt-2">
            <input
              v-model="model.subject"
              id="subject"
              name="subject"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
          </div>
        </div>
        <div class="sm:col-span-1">
          <label for="degree" class="block text-sm font-medium text-gray-900"
            >Degree</label
          >
          <div class="mt-2">
            <select
              v-model="model.degree"
              id="degree"
              name="degree"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm"
            >
              <option
                v-for="option in degreeOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
        </div>
        <div class="sm:col-span-1">
          <label
            for="dateOfIssue"
            class="block text-sm font-medium text-gray-900"
            >Date of issue</label
          >
          <div class="mt-2">
            <input
              v-model="model.dateOfIssue"
              id="dateOfIssue"
              name="dateOfIssue"
              type="date"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
          </div>
        </div>
        <div class="sm:col-span-6">
          <label for="body" class="block text-sm font-medium text-gray-900"
            >Message</label
          >
          <div class="mt-2">
            <input
              v-model="model.body"
              id="body"
              name="body"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </section>
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button
        type="button"
        class="text-sm font-semibold text-gray-900"
        @click="reset"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="submitting"
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {{ submitting ? "Saving..." : "Save" }}
      </button>
    </div>
  </form>
  <div
    v-else
    class="container mx-auto max-w-4xl bg-white rounded-lg shadow-lg p-6 my-8 space-y-2 font-medium text-gray-700"
  >
    <p v-for="(value, key) in model" :key="key">
      {{ key }}: <span class="font-normal">{{ value }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { DiplomaSchema } from "~/services/VerifiableCredential";

const degreeOptions = ["A+", "A-", "B+", "B-", "C+", "C-"];

const emit = defineEmits(["diploma-object-created"]);
const fillingForm = ref(true);

const model = reactive<DiplomaSchema>({
  signee: "Ahmed E.",
  documentNumber: "A001",
  subject: "Mathematics",
  degree: "A+",
  dateOfIssue: "2013-09-01",
  body: "Congrats!",
});

const submitting = ref(false);

function reset() {
  Object.assign(model, {
    signee: "",
    documentNumber: "",
    subject: "",
    degree: degreeOptions[0],
    dateOfIssue: "",
    body: "",
  });
}

async function onSubmit() {
  fillingForm.value = false;
  submitting.value = true;
  emit("diploma-object-created", { ...model });
  submitting.value = false;
}
</script>
