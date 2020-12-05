/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */

/**
 * Sample transaction processor function.
 * @param {org.ehr.basic.confirmAppointment} cnfap The sample transaction instance.
 * @transaction
 */
async function gettingAppointment(cnfap) {
  if (cnfap.appointment.status === 'CONFIRMED'){
    throw new Error('Appointment is already confirmed. Please meet the Doctor');
  }
  if (cnfap.appointment.status === 'CONSULTED'){
    throw new Error('Already consulted by Doctor');
  }
  if (cnfap.appointment.status === 'REJECTED'){
    throw new Error('Appointment is rejected');
  }
  if (cnfap.doctor.speciality != cnfap.appointment.group){
    throw new Error('Sorry !! No specialized Doctor in paticular Disease Ctaegory');
  }
  
  cnfap.appointment.status = 'CONFIRMED';
  cnfap.appointment.patient = cnfap.patient;
  cnfap.appointment.doctor = cnfap.doctor;
  
  const appointRegistry = await getAssetRegistry('org.ehr.basic.Appointment');
  await appointRegistry.update(cnfap.appointment);
}


/**
 * Sample transaction processor function.
 * @param {org.ehr.basic.consultation} cnst The sample transaction instance.
 * @transaction
 */
async function gettingChecked(cnst) {

  if (cnst.appointment.status === 'PENDING'){
    throw new Error('Appointment is still pending. !! Please wait');
  }  
  cnst.appointment.status = 'CONSULTED';
  cnst.appointment.group = cnst.patient.disease;
  cnst.appointment.consultionFee = cnst.doctor.consultationFee;
  cnst.patient.previousDebt = cnst.patient.previousDebt + cnst.appointment.consultationFee;
// cnst.appointment.insured = FALSE;
  }
    
  
  const appointRegistry = await getAssetRegistry('org.ehr.basic.Appointment');
  await appointRegistry.update(ctx.appoint);
  const patientRegistry = await getParticipantRegistry('org.ehr.basic.Patient');
  await patientRegistry.update(ctx.patient);
  const prescriptionRegistry = await getAssetRegistry('org.ehr.basic.Prescription');
  await prescriptionRegistry.update(pre);
}



/**
 * Sample transaction processor function.
 * @param {org.ehr.basic.labTest} lbtest The sample transaction instance.
 * @transaction
 */
async function gettingTest(lbtest) {
  lbtest.patient.previousDebt = lbtest.patient.previousDebt + lbtest.pathlab.testCost;
  
  const receipt = getFactory().newResource('org.ehr.basic', 'Receipt', 'R002');
  receipt.providedBy = lbtest.pathlab.id;
  receipt.providedTo = lbtest.patient.id;
  receipt.amountPaid = lbtest.pathlab.testCost;
   if (lbtest.patient.previousDebt > (2*(receipt.amountPaid))){
    throw new Error('Please pay atleast half of the total amount');
  }  
  bymed.patient.previousDebt = bymed.patient.previousDebt - bymed.chemist.medCost;
  receipt.curTime = lbtest.timestamp;
    
  
  const receiptRegistry = await getAssetRegistry('org.ehr.basic.Receipt');
  await receiptRegistry.addAll([receipt]);
  const patientRegistry = await getParticipantRegistry('org.ehr.basic.Patient');
  await patientRegistry.update(lbtest.patient);
}



/**
 * Sample transaction processor function.
 * @param {org.ehr.basic.buyMedicine} bymed The sample transaction instance.
 * @transaction
 */
async function gettingMedicine(bymed) {
  bymed.patient.previousDebt = bymed.patient.previousDebt + bymed.chemist.medCost;
  const receipt = getFactory().newResource('org.ehr.basic', 'Receipt', 'R001');
  receipt.providedBy = bymed.chemist.id;
  receipt.providedTo = bymed.patient.id;
  receipt.amountPaid = bymed.chemist.medCost;
  if (bymed.patient.previousDebt > (2*(receipt.amountPaid))){
    throw new Error('Please pay atleast half of the total amount');
  }  
  bymed.patient.previousDebt = bymed.patient.previousDebt - bymed.chemist.medCost;
 
 
  receipt.curTime = bymed.timestamp;
    
  
  const receiptRegistry = await getAssetRegistry('org.ehr.basic.Receipt');
  await receiptRegistry.addAll([receipt]);
  const patientRegistry = await getParticipantRegistry('org.ehr.basic.Patient');
  await patientRegistry.update(bymed.patient);
}


/*
/**
 * Sample transaction processor function.
 * @param {org.ehr.basic.insuranceClaim} inc The sample transaction instance.
 * @transaction
 */
 
 
 /*
async function insuranceClaim(inc) {

  if (inc.appointment.status != 'CONSULTED'){
    throw new Error('First consult with the Doctor');
  }  

}

*/


