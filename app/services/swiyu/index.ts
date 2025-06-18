import type { DiplomaSchema } from "../VerifiableCredential";
import { createApiClient, createVerifierAPIClient } from "./api";

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
    return { status: response.data.status };
}

export async function createSwiyuVerification(sd_fields: string[]): Promise<{ verificationId: string, verificationURL: string }> {
    const client = createVerifierAPIClient();
    const sd_fields_array = sd_fields.map(field => {
        return {
            "path": [
                `$.${field}`
            ]
        }
    });
    const response = await client.post(`/verifications`, {
        "accepted_issuer_dids": [
            "did:tdw:QmX9o7AbnJKZMUMhoXKEHzkcHH8mGwiwgxZFc9rFwHFism:identifier-reg.trust-infra.swiyu-int.admin.ch:api:v1:did:95df218d-30cf-4bf3-a864-8deb98ce3f63"
        ],
        "verification_validity_seconds": 86400,
        "jwt_secured_authorization_request": true,
        "presentation_definition": {
            "id": "4ac0a851-464f-4714-9b2f-0480865a0799",
            "name": "Verification for C4DT credential",
            "purpose": "We want to test a new Verifier",
            "input_descriptors": [
                {
                    "id": "4ac0a851-464f-4714-9b2f-0480865a0799",
                    "format": {
                        "vc+sd-jwt": {
                            "sd-jwt_alg_values": [
                                "ES256"
                            ],
                            "kb-jwt_alg_values": [
                                "ES256"
                            ]
                        }
                    },
                    "constraints": {
                        "fields": [
                            {
                                "path": [
                                    "$.vct"
                                ],
                                "filter": {
                                    "type": "string",
                                    "const": "monsters-uni"
                                }
                            },
                            ...sd_fields_array
                        ]
                    }
                }
            ]
        }
    });
    return {
        verificationId: response.data.id,
        verificationURL: response.data.verification_url
    }
}


export async function createSwiyuBetaIDVerification(): Promise<{ verificationId: string, verificationURL: string }> {
    const client = createVerifierAPIClient();
    const sd_fields_array = ["family_name", "document_number", "birth_date"].map(field => {
        return {
            "path": [
                `$.${field}`
            ]
        }
    });
    const response = await client.post(`/verifications`, {
        "accepted_issuer_dids": [
            "did:tdw:QmPEZPhDFR4nEYSFK5bMnvECqdpf1tPTPJuWs9QrMjCumw:identifier-reg.trust-infra.swiyu-int.admin.ch:api:v1:did:9a5559f0-b81c-4368-a170-e7b4ae424527"
        ],
        "verification_validity_seconds": 86400,
        "jwt_secured_authorization_request": true,
        "presentation_definition": {
            "id": "4ac0a851-464f-4714-9b2f-0480865a0799",
            "name": "Verification for C4DT credential",
            "purpose": "We want to test a new Verifier",
            "input_descriptors": [
                {
                    "id": "4ac0a851-464f-4714-9b2f-0480865a0799",
                    "format": {
                        "vc+sd-jwt": {
                            "sd-jwt_alg_values": [
                                "ES256"
                            ],
                            "kb-jwt_alg_values": [
                                "ES256"
                            ]
                        }
                    },
                    "constraints": {
                        "fields": [
                            {
                                "path": [
                                    "$.vct"
                                ],
                                "filter": {
                                    "type": "string",
                                    "const": "betaid-sdjwt"
                                }
                            },
                            ...sd_fields_array
                        ]
                    }
                }
            ]
        }
    });
    return {
        verificationId: response.data.id,
        verificationURL: response.data.verification_url
    }
}


export async function checkVerificationStatus(verificationId: string): Promise<any> {
    const client = createVerifierAPIClient();

    const response = await client.get(`/verifications/${verificationId}`);
    console.log(response.data);
    if (response.data.state === 'SU') {
        throw new Error(`Verification failed: ${response.data.error_message}`);
    }
    return { status: response.data.state, disclosedData: response.data.wallet_response };
}
