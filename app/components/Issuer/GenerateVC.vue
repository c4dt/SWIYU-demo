<template>
  <div class="flex items-center justify-center gap-x-6">
    <p>Generate Verifiable Credential for {{ connectionUserName }}?</p>
    <button
      type="button"
      @click="saveVerifiableCredential"
      class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Generate
    </button>
  </div>

  <div v-if="credentialDeepLink4QRCode" class="flex-auto text-center">
    Please scan this QR code to initiate your diploma verification!
    <br /><br />
    <qrcode-vue
      class="mx-auto"
      :value="credentialDeepLink4QRCode"
      level="H"
      size="300"
      render-as="svg"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import QrcodeVue from "qrcode.vue";
import { createSwiyuCredential } from "~/services/swiyu";

const props = defineProps(["credentialData"]);
const emit = defineEmits(["walletConnectionEstablished", "addToLog"]);
const connectionUserName = props.credentialData.signee;

const credentialDeepLink4QRCode = ref<string>("");

const saveVerifiableCredential = async () => {
  const { credentialId, credentialDeepLink } = await createSwiyuCredential(
    props.credentialData
  );
  emit("addToLog", "Creating connection QRCode", "Issuer");
  credentialDeepLink4QRCode.value = credentialDeepLink;
};
</script>
