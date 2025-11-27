import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import * as admin from 'firebase-admin';

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {
  constructor() {
    let serviceAccount = require("../../strimex.json")

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}
