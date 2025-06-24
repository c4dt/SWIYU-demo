<template>
  <div class="mt-14 flex min-h-[500px] rounded-xl bg-gray-50 shadow-md">
    <div class="mt-10 ml-10 flex-1 p-4">
      <IssuerGenerateVC
        v-if="stage !== Stage.CREDENTIAL_FORM && stage !== Stage.OFFER_ACCEPTED"
        :credential-data="CredentialData"
        @add-to-log="addToLog"
        @notify-v-c-received="NotifyVCReceived"
      />
      <IssuerDiplomaCredentialForm
        v-if="stage !== Stage.OFFER_ACCEPTED"
        @diploma-object-created="createCredentialData"
        @add-to-log="addToLog"
      />
      <div
        v-if="stage === Stage.OFFER_ACCEPTED"
        class="text-center text-green-600"
      >
        <h2 class="mb-2 text-xl font-semibold">Issuance Succeeded!</h2>
        <p class="text-sm">
          The holder has successfully received their credential.
        </p>
      </div>
    </div>

    <div class="-mt-10 w-72 rounded-md bg-gray-100 p-6 shadow-lg">
      <h2 class="text-xl font-semibold">Updates</h2>
      <ol class="list-decimal">
        <li v-for="(message, index) in logMessages" :key="index" class="mt-2">
          [{{ message.source
          }}{{ message.target ? ` → ${message.target}` : '' }}]
          {{ message.message }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type {
    ActionLog,
    DiplomaSchema,
  } from '~/services/VerifiableCredential';

  definePageMeta({ layout: 'c4dt' });

  enum Stage {
    CREDENTIAL_FORM,
    CREDENTIAL_CREATED,
    VC_OFFER_CREATED,
    OFFER_ACCEPTED,
  }

  const stage = ref<Stage>(Stage.CREDENTIAL_FORM);
  const CredentialData = ref<DiplomaSchema>({} as DiplomaSchema);
  const logMessages = ref<ActionLog[]>([
    {
      message: 'Verification request created',
      source: 'Verifier',
    },
    {
      message: 'Checking periodically for user scanning.',
      source: 'Verifier',
    },
    {
      message: 'Verifies DID of verifier through base registry!',
      source: 'Wallet',
    },
    {
      message: 'retrieves verified actor status from trust registry!',
      source: 'Wallet',
    },
    {
      message: 'received VC with a valid signature!',
      source: 'Verifier',
    },
  ]);

  function createCredentialData(createdCredential: DiplomaSchema): void {
    CredentialData.value = createdCredential;
    stage.value = Stage.CREDENTIAL_CREATED;
    addToLog('Credential Data saved', 'Issuer', '');
  }

  function addToLog(
    message: string,
    source: string = 'Issuer',
    target?: string
  ): void {
    logMessages.value.push({ source, target, message });
  }

  function NotifyVCReceived(): void {
    stage.value = Stage.OFFER_ACCEPTED;
    addToLog('Credential was issued and received!', 'Wallet');
  }
</script>
