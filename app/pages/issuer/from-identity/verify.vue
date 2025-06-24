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
              Obtain Your Workshop Credential
            </h2>
            <p class="mt-1 text-sm text-gray-600">
              First step: Verify your identity
            </p>
          </header>
          <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-4">
              <p class="mt-2 text-sm text-red-500">
                We ask for the following data:
              </p>
              <div class="flex flex-col gap-2">
                <label class="inline-flex cursor-pointer items-center gap-2">
                  - Given Name & Surname
                </label>
                <label class="inline-flex cursor-pointer items-center gap-2">
                  - Birth date
                </label>
                <label class="inline-flex cursor-pointer items-center gap-2">
                  - BETA-ID number
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
                submitting ? 'Generating...' : 'Start the verification process!'
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
        <div class="mt-6 flex items-center justify-center gap-x-6">
          <button
            type="button"
            class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="redirectToCredentialGeneration"
          >
            Generate Credential for this identity?
          </button>
        </div>
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
    createSwiyuBetaIDVerification,
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
  const verificationURL = ref<string>('');
  const verificationId = ref<string>('');
  const submitting = ref(false);
  const verificationRequestStatus = ref<string>('PENDING');

  async function createVerificationRequest(): Promise<void> {
    submitting.value = true;
    ({
      verificationId: verificationId.value,
      verificationURL: verificationURL.value,
    } = await createSwiyuBetaIDVerification());
    step.value = Step.VERIFICATION_CREATED;
    addToLog('Verification request created.', 'Verifier');
    addToLog('Checking periodically for user scanning.', 'Verifier');
    submitting.value = false;
  }

  const disclosedData = ref<Record<string, any>>({});
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
        addToLog('Verifies DID of verifier through base registry!', 'Wallet');
        addToLog(
          'retrieves verified actor status from trust registry!',
          'Wallet'
        );

        if (status === 'SUCCESS') {
          clearInterval(checkStatusInterval);
          addToLog('received VC with a valid signature!', 'Verifier');
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

  function redirectToCredentialGeneration(): void {
    console.log(disclosedData.value);
    navigateTo({
      path: '/issuer/from-identity/issue',
      query: {
        firstName: disclosedData.value.credential_subject_data.given_name,
        lastName: disclosedData.value.credential_subject_data.family_name,
        birthDate: disclosedData.value.credential_subject_data.birth_date,
        betaIdDocumentNumber:
          disclosedData.value.credential_subject_data.document_number,
        betaIdCnf: JSON.stringify(
          disclosedData.value.credential_subject_data.cnf
        ),
      },
    });
    console.log('Redirecting to credential generation...');
  }

  definePageMeta({ layout: 'c4dt' });
  useHead({
    title: 'C4DT E-ID Workshop - Verify Identity',
  });
</script>
