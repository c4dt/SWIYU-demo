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
        <div class="sm:col-span-2">
          <label for="firstName" class="block text-sm font-medium text-gray-900">
            First Name
          </label>
          <div class="mt-2">
            <input v-model="model.firstName" id="firstName" name="firstName" disabled type="text" autocomplete="off"
              class="
              block w-full rounded-md border-0 py-1.5
              text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600
              sm:text-sm
              disabled:bg-gray-100 disabled:text-gray-500 disabled:ring-gray-200
              disabled:cursor-not-allowed
              ">
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="lastName" class="block text-sm font-medium text-gray-900">
            Last Name
          </label>
          <div class="mt-2">
            <input v-model="model.lastName" id="lastName" name="lastName" disabled type="text" autocomplete="off" class="
              block w-full rounded-md border-0 py-1.5
              text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600
              sm:text-sm
              disabled:bg-gray-100 disabled:text-gray-500 disabled:ring-gray-200
              disabled:cursor-not-allowed
              ">
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="birthDate" class="block text-sm font-medium text-gray-900">Date of birth</label>
          <div class="mt-2">
            <input v-model="model.birthDate" id="birthDate" name="birthDate" disabled type="text" autocomplete="off"
              class="
              block w-full rounded-md border-0 py-1.5
              text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600
              sm:text-sm
              disabled:bg-gray-100 disabled:text-gray-500 disabled:ring-gray-200
              disabled:cursor-not-allowed
              ">
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="dateOfIssue" class="block text-sm font-medium text-gray-900">Date of issue</label>
          <div class="mt-2">
            <input v-model="model.dateOfIssue" id="dateOfIssue" name="dateOfIssue" type="dateOfIssue" disabled class="
              block w-full rounded-md border-0 py-1.5
              text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600
              sm:text-sm
              disabled:bg-gray-100 disabled:text-gray-500 disabled:ring-gray-200
              disabled:cursor-not-allowed
              ">
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="betaIdDocumentNumber" class="block text-sm font-medium text-gray-900">Beta ID Document
            Number</label>
          <div class="mt-2">
            <input v-model="model.betaIdDocumentNumber" id="betaIdDocumentNumber" name="betaIdDocumentNumber"
              type="text" disabled class="
              block w-full rounded-md border-0 py-1.5
              text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600
              sm:text-sm
              disabled:bg-gray-100 disabled:text-gray-500 disabled:ring-gray-200
              disabled:cursor-not-allowed
              ">
          </div>
        </div>
        <div class="sm:col-span-4">
          <label for="betaIdCnf" class="block text-sm font-medium text-gray-900">CNF data</label>
          <div class="mt-2">
            <input v-model="model.betaIdCnf" id="betaIdCnf" name="betaIdCnf" type="text" disabled class="
              block w-full rounded-md border-0 py-1.5
              text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600
              sm:text-sm
              disabled:bg-gray-100 disabled:text-gray-500 disabled:ring-gray-200
              disabled:cursor-not-allowed
              ">
          </div>
        </div>
      </div>
    </section>
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="button" class="text-sm font-semibold text-gray-900" @click="reset">
        Cancel
      </button>
      <button type="submit" :disabled="submitting"
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        {{ submitting ? "Saving..." : "Save" }}
      </button>
    </div>
  </form>
  <div v-else
    class="container mx-auto max-w-4xl bg-white rounded-lg shadow-lg p-6 my-8 space-y-2 font-medium text-gray-700">
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


const route = useRoute()

const model = reactive<DiplomaSchema>({
  firstName: route.query.firstName as string,
  lastName: route.query.lastName as string,
  birthDate: route.query.birthDate as string,
  dateOfIssue: new Date().toDateString(),
  betaIdDocumentNumber: route.query.betaIdDocumentNumber as string,
  betaIdCnf: route.query.betaIdCnf as string,
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
