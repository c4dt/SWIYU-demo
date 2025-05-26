<template>
  <div class="flex flex-col items-center gap-y-8">
    <div class="flex items-center gap-x-6">
      <p>Generate Verifiable Credential for {{ signee }}?</p>
      <button
        type="button"
        @click="onGenerate"
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
        <span
          class="font-mono text-xs bg-gray-50 rounded-md p-2 max-w-xl mx-auto break-all select-all"
        >
          URL: {{ deepLink }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import QrcodeVue from "qrcode.vue";
import { createSwiyuCredential } from "~/services/swiyu";
import { checkCredentialOfferStatus } from "~/services/swiyu";

const props = defineProps(["credentialData"]);
const emit = defineEmits(["addToLog"]);

const signee = computed(() => props.credentialData.signee);

const deepLink = ref<string>("");
const createdCredentialId = ref<string>("");

setInterval(async () => {
  if (createdCredentialId.value) {
    const { status } = await checkCredentialOfferStatus(
      createdCredentialId.value
    );
    if (status === "IN_PROGRESS") {
      emit("addToLog", "QR code has been scanned!");
    } else if (status === "ISSUED") {
      emit("addToLog", "Credential offer has been accepted");
      clearInterval(this);
    } else {
      console.log("Still figuring it out...");
    }
  }
}, 1000);

const onGenerate = async (): Promise<void> => {
  emit("addToLog", "Creating VC offer QRCode");
  const { credentialId, credentialDeepLink } = await createSwiyuCredential(
    props.credentialData
  );
  createdCredentialId.value = credentialId;
  deepLink.value = credentialDeepLink;
  emit("addToLog", "Offer Created - pulling status updates");
};
</script>
