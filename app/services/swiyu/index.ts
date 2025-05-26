import type { DiplomaSchema } from "../VerifiableCredential";
import { createApiClient } from "./api";


export async function createSwiyuCredential(credentialData: DiplomaSchema): Promise<any> {
    const client = createApiClient();

    const response = await client.post('/credentials', {
        "metadata_credential_supported_id": [
            "monsters-uni"
        ],
        "credential_subject_data": {
            "signee": credentialData.signee,
            "degree": credentialData.degree,
            "document_number": credentialData.documentNumber,
            "subject": credentialData.subject,
            "date_of_issue": credentialData.dateOfIssue
        },
        "offer_validity_seconds": 86400,
        "credential_valid_until": "2030-01-01T19:23:24Z",
        "credential_valid_from": new Date(credentialData.dateOfIssue).toISOString()
    })
    return {
        credentialId: response.data.management_id,
        credentialDeepLink: response.data.offer_deeplink,
    }
}


export async function checkCredentialOfferStatus(credentialId: string): Promise<any> {
    const client = createApiClient();

    const response = await client.get(`/credentials/${credentialId}/status`);
    console.log(response.data);
    return { status: response.data.status };
}
