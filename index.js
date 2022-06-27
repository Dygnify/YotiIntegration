// Point the Doc Scan client at the sandbox by setting environment variable YOTI_DOC_SCAN_API_URL to https://api.yoti.com/sandbox/idverify/v1
require("dotenv").config();
const fs = require("fs");
const { SandboxDocScanClientBuilder } = require("@getyoti/sdk-sandbox");
const {
  SessionSpecificationBuilder,
  RequestedDocumentAuthenticityCheckBuilder,
  RequestedLivenessCheckBuilder,
  RequestedTextExtractionTaskBuilder,
  RequestedFaceMatchCheckBuilder,
  SdkConfigBuilder,
  NotificationConfigBuilder,
  DocScanClient,
  Client,
  RequestedThirdPartyIdentityCheckBuilder,
  RequestedWatchlistScreeningCheckBuilder
} = require("yoti");


const SANDBOX_CLIENT_SDK_ID = process.env.YOTI_CLIENT_SDK_ID;
const PEM = fs.readFileSync("./path/to/pem/privateKey.pem", "utf8");
const yotiClient = new Client(SANDBOX_CLIENT_SDK_ID, PEM);
const sandboxClient = new SandboxDocScanClientBuilder()
  .withClientSdkId(SANDBOX_CLIENT_SDK_ID)
  .withPemString(PEM)
  .build();

  const docScanClient = new DocScanClient(
    SANDBOX_CLIENT_SDK_ID,
    PEM
 );
//Document Authenticity Check
const documentAuthenticityCheck =
  new RequestedDocumentAuthenticityCheckBuilder().build();

//Liveness check with 3 retries
const livenessCheck = new RequestedLivenessCheckBuilder()
  .forZoomLiveness()
  .withMaxRetries(3)
  .build();

//Face Match Check with manual check set to fallback
const faceMatchCheck = new RequestedFaceMatchCheckBuilder()
  .withManualCheckFallback()
  .build();

//ID Document Text Extraction Task with manual check set to fallback
const textExtractionTask = new RequestedTextExtractionTaskBuilder()
  .withManualCheckFallback()
  .build();

//Configuration for the client SDK (Frontend)
const sdkConfig = new SdkConfigBuilder()
  .withAllowsCameraAndUpload()
  .withPrimaryColour("#2d9fff")
  .withSecondaryColour("#FFFFFF")
  .withFontColour("#FFFFFF")
  .withLocale("en-GB")
  .withPresetIssuingCountry("GBR")
  .withSuccessUrl(`https://api.yoti.com/sandbox/idverify/v1/index`)
  .withErrorUrl(`https://api.yoti.com/sandbox/idverify/v1/profile`)
  .withPrivacyPolicyUrl(`https://api.yoti.com/sandbox/idverify/v1/privacy-policy`)
  .withAllowHandoff(true)
  .build();

const thirdPartyIdentityCheck = new RequestedThirdPartyIdentityCheckBuilder()
  .build();

const watchlistScreeningCheck = new RequestedWatchlistScreeningCheckBuilder()
  .withAdverseMediaCategory()
  .withSanctionsCategory()
  .build()

//Buiding the Session with defined specification from above
const sessionSpec = new SessionSpecificationBuilder()
  .withClientSessionTokenTtl(600)
  .withResourcesTtl(604800)
  .withUserTrackingId("some-user-tracking-id")
  .withRequestedCheck(documentAuthenticityCheck)
  .withRequestedCheck(livenessCheck)
  .withRequestedCheck(faceMatchCheck)
  .withRequestedTask(textExtractionTask)
  .withRequestedCheck(thirdPartyIdentityCheck)
  .withRequestedCheck(watchlistScreeningCheck)
  .withSdkConfig(sdkConfig)
  .build();

  docScanClient
    .createSession(sessionSpec)
    .then((session) => {
        const sessionId = session.getSessionId();
        console.log("**** Session id " + sessionId);
        const clientSessionToken = session.getClientSessionToken();
        console.log("**** Client Token " + clientSessionToken);
        const clientSessionTokenTtl = session.getClientSessionTokenTtl();
        console.log("**** Client Token ttl " + clientSessionToken);
    })
    .catch((err) => {
        console.log(err)
    });


let sessionId = "";

if(sessionId === ""){

}
else{
  // Returns a session result
  docScanClient.getSession(sessionId).then(session => {
    // Returns the session state
    const state = session.getState();
    
    // Returns session resources
    const resources = session.getResources();

    // Returns all checks on the session
    const checks = session.getChecks();

    // Return specific check types
    const authenticityChecks = session.getAuthenticityChecks();
    const faceMatchChecks = session.getFaceMatchChecks();
    const textDataChecks = session.getTextDataChecks();
    const livenessChecks = session.getLivenessChecks();
    const watchlistScreeningChecks = session.getWatchlistScreeningChecks();
    const watchlistAdvancedCaChecks = session.getWatchlistAdvancedCaChecks();

    // Returns biometric consent timestamp
    const biometricConsent = session.getBiometricConsentTimestamp();
    
  }).catch(error => {
    // handle error
  })

  // Retrieve user data
  docScanClient.getSession(sessionId).then(session => {
    // Returns all resources in the session
    const resources = session.getResources();

    // Returns a collection of ID Documents
    const idDocuments = resources.getIdDocuments();

    idDocuments.map((idDocument) => {

        // Gets the UUID of the document resource
        const id = idDocument.getId();

        // Returns the ID Document Type
        const documentType = idDocument.getDocumentType();

        // Returns the ID Document country
        const issuingCountry = idDocument.getIssuingCountry();

        // Returns pages of an ID Document
        const pages = idDocument.getPages();
        // Get pages media ids
        const pageMediaIds = pages.map(page => {
            if (page.getMedia() && page.getMedia().getId()) {
                return page.getMedia().getId();
            }
            return null;
        });

        // Returns document fields object
        const documentFields = idDocument.getDocumentFields();
        // Get document fields media id
        let documentFieldsMediaId = null;
        if (documentFields) {
            documentFieldsMediaId = documentFields.getMedia().getId();
        }
    });

    // Returns a collection of liveness capture resources
    const livenessCapture = resources.getLivenessCapture();
    const zoomLiveness = resources.getZoomLivenessResources();
    
  }).catch(error => {
    console.log(error)
    // handle error
  })

  // Retrieve images
  let pageMediaId = "";
  docScanClient.getMediaContent(sessionId, pageMediaId).then(media => {
    const content = media.getContent();
    const buffer = content.toBuffer();
    const base64Content = media.getBase64Content();
    const mimeType = media.getMimeType();
    // handle base64content or buffer
  }).catch(error => {
    console.log(error)
    // handle error
  })

}
