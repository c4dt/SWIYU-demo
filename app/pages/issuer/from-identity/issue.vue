<template>
  <div class="flex items-center bg-gray-100">
    <nav class="rounded-md bg-white p-2 text-sm shadow-lg sm:text-base lg:p-4">
      <ol class="inline-flex list-none p-0">
        <li class="flex items-center">
          <NuxtLink
            to="/issuer"
            class="flex items-center text-gray-600 transition-colors duration-300 hover:text-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 576 512"
              class="mr-1 fill-gray-600 transition-colors duration-300 hover:fill-blue-500"
            >
              <path
                d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
              />
            </svg>
            Home
          </NuxtLink>
          <span class="mx-2">/</span>
        </li>
        <li>Issue Credential</li>
      </ol>
    </nav>
  </div>

  <div class="mt-14 flex min-h-[500px] rounded-xl bg-gray-50 shadow-md">
    <div class="mt-10 ml-10 flex-1 p-4">
      <IssuerGenerateVC
        v-if="stage !== Stage.CREDENTIAL_FORM"
        :credential-data="CredentialData"
        @add-to-log="addToLog"
      />
      <IssuerDiplomaCredentialForm
        @diploma-object-created="createCredentialData"
        @add-to-log="addToLog"
      />
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
  const logMessages = ref<ActionLog[]>([]);

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
</script>
