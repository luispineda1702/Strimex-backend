import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../firebase-admin.json';

@Injectable()
export class FirebaseAdminService {
  private app: admin.app.App;

  constructor() {
    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  verifyIdToken(token: string) {
    return this.app.auth().verifyIdToken(token);
  }
}
