<template>
  <div class="mt-14 flex min-h-[500px] rounded-xl bg-gray-50 shadow-md">
    <div class="mt-10 ml-10 flex-1">
      <div
        v-if="step === Step.VERIFICATION_FORM"
        class="flex items-center justify-center gap-6"
      >
        <form @submit.prevent="createVerificationRequest">
          <header class="border-b border-gray-200 pb-6">
            <h2 class="text-base font-semibold text-gray-900">
              Check which properties(?) you want the holder to disclose:
            </h2>
            <p class="mt-1 text-sm text-gray-600">
              This form represents the C4DT toy certification
            </p>
          </header>
          <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-4">
              <p v-if="!formIsValid" class="mt-2 text-sm text-red-500">
                At least one must be selected.
              </p>
              <div class="flex flex-col gap-2">
                <label
                  v-for="option in fieldOptions"
                  :key="option.value"
                  class="inline-flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    class="form-checkbox accent-blue-600"
                    :value="option.value"
                    :checked="selectedFields.includes(option.value)"
                    @change="() => toggleFieldChoice(option.value)"
                  />
                  <span>{{ option.label }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              :disabled="submitting"
              class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {{
                submitting ? 'Generating...' : 'Generate Verification QR Code!'
              }}
            </button>
          </div>
        </form>
      </div>
      <div
        v-if="step === Step.VERIFICATION_CREATED"
        class="flex flex-col items-center text-center"
      >
        <span>
          Please scan this QR code to accept the verification request!
        </span>
        <qrcode-vue
          class="mx-auto my-4"
          :value="verificationURL"
          level="H"
          size="250"
          render-as="svg"
        />
        <div class="break-all">
          <div>
            Verification ID:
            <span class="font-mono">{{ verificationId }}</span>
          </div>
          <span>Verification URL:</span>
          <span
            class="mx-auto max-w-xl rounded-md bg-gray-50 p-2 font-mono text-xs break-all select-all"
          >
            {{ verificationURL }}
          </span>
        </div>
      </div>
      <div v-if="step === Step.VERIFICATION_SUCCEEDED">
        <div class="text-center text-green-600">
          <h2 class="mb-2 text-xl font-semibold">Verification Succeeded!</h2>
          <p class="text-sm">
            The holder has successfully verified their credential.
          </p>
        </div>
        <details class="mt-4 flex-1 break-all">
          <summary class="cursor-pointer text-sm font-semibold text-center">
            Click here to view the disclosed data
          </summary>
          <KeyValueDisplay :data="disclosedData" />
        </details>
      </div>
      <div
        v-if="step === Step.VERIFICATION_FAILED"
        class="text-center text-red-600"
      >
        <h2 class="mb-2 text-xl font-semibold">Verification Failed!</h2>
        <p class="text-sm">The holder failed to verify their credential.</p>
      </div>
    </div>
    <aside class="-mt-10 w-72 rounded-md bg-gray-300 p-6 shadow-lg">
      <h2 class="mb-2 text-xl font-semibold">Updates</h2>
      <ol class="ml-4 list-decimal space-y-1">
        <li v-for="(message, index) in logMessages" :key="index" class="mt-2">
          [{{ message.source
          }}{{ message.target ? ` → ${message.target}` : '' }}]
          {{ message.message }}
        </li>
      </ol>
    </aside>
  </div>
</template>
<script setup lang="ts">
  import QrcodeVue from 'qrcode.vue';

  import type { ActionLog } from '~/services/VerifiableCredential';
  import {
    checkVerificationStatus,
    createSwiyuVerification,
  } from '~/services/swiyu/index';
  const logMessages = ref<ActionLog[]>([]);

  function addToLog(
    message: string,
    source: string = 'Issuer',
    target?: string
  ): void {
    logMessages.value.push({ source, target, message });
  }

  enum Step {
    VERIFICATION_FORM,
    VERIFICATION_CREATED,
    VERIFICATION_SUCCEEDED,
    VERIFICATION_FAILED,
  }
  const step = ref<Step>(Step.VERIFICATION_FORM);
  const formIsValid = computed(() => selectedFields.value.length > 0);
  const verificationURL = ref<string>('');
  const verificationId = ref<string>('');
  const submitting = ref(false);
  const verificationRequestStatus = ref<string>('PENDING');
  const fieldOptions = [
    { label: 'First Name', value: 'firstName' },
    { label: 'Last Name', value: 'lastName' },
    { label: 'Degree', value: 'degree' },
    { label: 'Date of Birth', value: 'birthDate' },
    { label: 'Document Issuance date', value: 'dateOfIssue' },
    { label: 'Gov ID Document Number', value: 'betaIdDocumentNumber' },
  ];
  const selectedFields = ref<string[]>([]);

  const toggleFieldChoice = (val: string) => {
    selectedFields.value = selectedFields.value.includes(val)
      ? selectedFields.value.filter((v) => v !== val)
      : [...selectedFields.value, val];
  };
  async function createVerificationRequest(): Promise<void> {
    submitting.value = true;
    ({
      verificationId: verificationId.value,
      verificationURL: verificationURL.value,
    } = await createSwiyuVerification(selectedFields.value));
    step.value = Step.VERIFICATION_CREATED;
    addToLog('Verification request created successfully.', 'Verifier');
    // Here you would typically display the QR code or link to the user
    // For example, you could use a QR code component to show the verification URL
    console.log('Verification URL:', verificationURL.value);
    submitting.value = false;
  }

  const disclosedData = ref<Record<string, unknown>>({});
  onMounted(() => {
    const checkStatusInterval = setInterval(async () => {
      if (verificationId.value) {
        let status = null;
        ({ status, disclosedData: disclosedData.value } =
          await checkVerificationStatus(verificationId.value));
        if (status !== verificationRequestStatus.value) {
          verificationRequestStatus.value = status;
        } else {
          console.log('No status change detected.');
          return;
        }
        if (status === 'SUCCESS') {
          clearInterval(checkStatusInterval);
          addToLog('Verification request was fulfiled!');
          step.value = Step.VERIFICATION_SUCCEEDED;
        } else if (status === 'FAILED') {
          clearInterval(checkStatusInterval);
          addToLog('Verification request failed to be fulfilled!');
          step.value = Step.VERIFICATION_FAILED;
        } else {
          console.log('Still figuring it out...');
        }
      }
    }, 2500);
  });

  definePageMeta({ layout: 'leo-inc' });
  useHead({
    title: 'Leo Inc. HR - Employees',
    meta: [
      {
        name: 'description',
        content:
          'Manage Employee Information and maintain their contact information.',
      },
    ],
  });
</script>
