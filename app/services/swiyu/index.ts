import axios from "axios";
import type { DiplomaSchema } from "../VerifiableCredential";


export async function createSwiyuCredential(credentialData: DiplomaSchema): Promise<any> {
    const client = axios.create({
        baseURL: "http://localhost/internal/api/v1",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const response = await client.post('/credentials', {
        "metadata_credential_supported_id": [
            "my-test-vc"
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
