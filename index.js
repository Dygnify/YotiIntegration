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
  Client
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

//Buiding the Session with defined specification from above
const sessionSpec = new SessionSpecificationBuilder()
  .withClientSessionTokenTtl(600)
  .withResourcesTtl(604800)
  .withUserTrackingId("some-user-tracking-id")
  .withRequestedCheck(documentAuthenticityCheck)
  .withRequestedCheck(livenessCheck)
  .withRequestedCheck(faceMatchCheck)
  .withRequestedTask(textExtractionTask)
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