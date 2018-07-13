/**
 * Track the trade of a commodity from one trader to another
 * @param {org.example.mynetwork.SignDocument} signDocument - the trade to be processed
 * @transaction
 */
async function signTheDocument(signDocument) {
    let usernameHash = 0;
    for (var i = 0; i < signDocument.person.username.length; i++) {
        var character = this.charCodeAt(i);
        usernameHash = ((usernameHash<<5)-usernameHash)+character;
        usernameHash = usernameHash & usernameHash; // Convert to 32bit integer
    }
    let passwordHash = 0;
    for (var i = 0; i < signDocument.person.password.length; i++) {
        var character = this.charCodeAt(i);
        passwordHash = ((passwordHash<<5)-passwordHash)+character;
        passwordHash = passwordHash & passwordHash; // Convert to 32bit integer
    }
    let documentHash = 0;
    for (var i = 0; i < signDocument.document.hashcode.length; i++) {
        var character = this.charCodeAt(i);
        documentHash = ((documentHash<<5)-documentHash)+character;
        documentHash = documentHash & documentHash; // Convert to 32bit integer
    }
    signatureHash = 7 * (7 * usernameHash + passwordHash) + documentHash;

    let signature = factory.newAsset('org.example.mynetowrk','Signature',signatureHash.toString());
    signature.signee = signDocument.person;
    let signatureRegistry = await getAssetRegistry('org.example.mynetwork.Signature');
    await signatureRegistry.add(signature);

    signDocument.document.documentSignature  = signature;
    let documentRegistry = await getAssetRegistry('org.example.mynetwork.Document');
    await documentRegistry.update(signDocument.document);

    signDocument.person.documents.push(signDocument.document);
    let personRegistry = await getAssetRegistry('org.example.mynetwork.Person');
    await personRegistry.update(signDocument.person);
}

/**
 * Track the trade of a commodity from one trader to another
 * @param {org.example.mynetwork.CreateDocument} createDocument - the trade to be processed
 * @transaction
 */
async function uploadDocument(createDocument) {
    let usernameHash = 0;
    for (var i = 0; i < createDocument.person.username.length; i++) {
        var character = this.charCodeAt(i);
        usernameHash = ((usernameHash<<5)-usernameHash)+character;
        usernameHash = usernameHash & usernameHash; // Convert to 32bit integer
    }
    let passwordHash = 0;
    for (var i = 0; i < createDocument.person.password.length; i++) {
        var character = this.charCodeAt(i);
        passwordHash = ((passwordHash<<5)-passwordHash)+character;
        passwordHash = passwordHash & passwordHash; // Convert to 32bit integer
    }
    let dataHash = 0;
    for (var i = 0; i < createDocument.data.length; i++) {
        var character = this.charCodeAt(i);
        dataHash = ((dataHash<<5)-dataHash)+character;
        dataHash = dataHash & dataHash; // Convert to 32bit integer
    }
    documentHash = 7 * (7 * usernameHash + passwordHash) + dataHash;

    let document = factory.newAsset('org.example.mynetwork','Document',documentHash.toString());
    document.data = createDocument.data;
    let documentRegistry = await getAssetRegistry('org.example.mynetwork.Document');
    await documentRegistry.add(document);

    createDocument.person.documents.push(document);
    let personRegistry = await getAssetRegistry('org.example.mynetwork.Person');
    await personRegistry.update(createDocument.person);
}