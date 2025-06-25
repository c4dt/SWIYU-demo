<template>
  <div class="flex flex-col items-center gap-y-8">
    <div v-if="!deepLink" class="flex items-center gap-x-6">
      <p>Generate Verifiable Credential for {{ signee }}?</p>
      <button
        type="button"
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="onGenerate"
      >
        Generate
      </button>
    </div>

    <div v-if="deepLink" class="flex flex-col items-center text-center">
      <span>Please scan this QR code to accept the verifiable credential!</span>
      <qrcode-vue
        class="mx-auto my-4"
        :value="deepLink"
        level="H"
        size="250"
        render-as="svg"
      />
      <div class="break-all">
        <div>
          Credential ID:
          <span class="font-mono">{{ createdCredentialId }}</span>
        </div>
        <span>Pre-Authorization Code:</span>
        <span
          class="mx-auto max-w-xl rounded-md bg-gray-50 p-2 font-mono text-xs break-all select-all"
        >
          {{ getCredentialOfferPreAuthCode(deepLink) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import QrcodeVue from 'qrcode.vue';
  import { computed, ref } from 'vue';
  import {
    checkCredentialOfferStatus,
    createSwiyuCredential,
  } from '~/services/swiyu';

  const props = defineProps(['credentialData']);
  const emit = defineEmits(['addToLog', 'NotifyVCReceived']);

  const signee = computed(
    () => props.credentialData.firstName + ' ' + props.credentialData.lastName
  );

  const deepLink = ref<string>('');
  const createdCredentialId = ref<string>('');
  const credentialOfferStatus = ref<string>('OFFERED');
  const checkStatusInterval = setInterval(async () => {
    if (createdCredentialId.value) {
      const { status } = await checkCredentialOfferStatus(
        createdCredentialId.value
      );
      if (status !== credentialOfferStatus.value) {
        credentialOfferStatus.value = status;
      } else {
        console.log('No status change detected.');
        return;
      }
      if (status === 'IN_PROGRESS') {
        emit('addToLog', 'Credential offer token has been redeemed!');
      } else if (status === 'ISSUED') {
        emit('NotifyVCReceived');
        clearInterval(checkStatusInterval);
      } else {
        console.log('Still figuring it out...');
      }
    }
  }, 2500);

  const onGenerate = async (): Promise<void> => {
    emit('addToLog', 'Creating VC offer QR code');
    const { credentialId, credentialDeepLink } = await createSwiyuCredential(
      props.credentialData
    );
    createdCredentialId.value = credentialId;
    deepLink.value = credentialDeepLink;
    emit('addToLog', 'Offer Created!');
    emit('addToLog', 'Periodically checking credential for QR code scanning.');
  };

  function getCredentialOfferPreAuthCode(url: string): object | null {
    try {
      // 1. Parse the URL and extract the search params
      const urlObj = new URL(url);

      // 2. Get the 'credential_offer' param (will be URL-encoded)
      const encodedOffer = urlObj.searchParams.get('credential_offer');
      if (!encodedOffer) {
        throw new Error('No credential_offer parameter found.');
      }

      // 3. Decode URI component
      const decodedOffer = decodeURIComponent(encodedOffer);

      // 4. Parse as JSON
      const credentialOfferObj = JSON.parse(decodedOffer);
      return credentialOfferObj?.grants?.[
        'urn:ietf:params:oauth:grant-type:pre-authorized_code'
      ]?.['pre-authorized_code'];
    } catch (err) {
      console.error('Error decoding credential offer:', err);
      return null;
    }
  }
</script>
