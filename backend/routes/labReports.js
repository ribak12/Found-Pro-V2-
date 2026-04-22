const express = require('express');
const LabReport = require('../models/LabReport');

const router = express.Router();

function toClientReport(req, reportDoc) {
  const pdfUrl = reportDoc.pdfUrl
    ? reportDoc.pdfUrl.startsWith('http')
      ? reportDoc.pdfUrl
      : `${req.protocol}://${req.get('host')}${reportDoc.pdfUrl}`
    : '';

  return {
    id: reportDoc.reportId,
    access: reportDoc.accessCode,
    dob: reportDoc.patientDob || '',
    patient: reportDoc.patientName,
    test: reportDoc.test,
    date: reportDoc.date,
    eta: reportDoc.eta,
    status: reportDoc.status,
    pdf: pdfUrl,
    previewTitle: reportDoc.previewTitle,
    previewText: reportDoc.previewText,
    meta: (reportDoc.meta || []).map(item => [item.label, item.value]),
    chips: reportDoc.chips || [],
    values: (reportDoc.values || []).map(item => [
      item.testName,
      item.result,
      item.range
    ]),
    valuesNote: reportDoc.valuesNote || ''
  };
}

router.get('/check', async (req, res) => {
  try {
    const reportId = String(req.query.reportId || '').trim().toUpperCase();
    const accessCode = String(req.query.accessCode || '').trim();
    const patientDob = String(req.query.patientDob || '').trim();

    if (!reportId || !accessCode) {
      return res.status(400).json({ message: 'Report ID and access code are required.' });
    }

    const report = await LabReport.findOne({ reportId, accessCode });

    if (!report) {
      return res.status(404).json({ message: 'No matching report found.' });
    }

    if (patientDob && report.patientDob && patientDob !== report.patientDob) {
      return res.status(404).json({ message: 'No matching report found.' });
    }

    return res.json({ report: toClientReport(req, report) });
  } catch (error) {
    console.error('Lab report check failed:', error);
    return res.status(500).json({ message: 'Failed to check report.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const report = await LabReport.create(req.body);
    return res.status(201).json({ report });
  } catch (error) {
    console.error('Create lab report failed:', error);
    return res.status(400).json({ message: 'Failed to create report.' });
  }
});

router.get('/seed-demo', async (req, res) => {
  try {
    const demoReports = [
      {
        reportId: '012409060091',
        accessCode: '0091',
        patientDob: '',
        patientName: 'Mr. BIPUL CH BORO',
        test: 'Thyroid Function Test',
        date: '06 Sep 2024 · 12:36 PM',
        eta: 'Ready now',
        status: 'ready',
        pdfUrl: '/reports/thyroid-function-test-report.pdf',
        previewTitle: 'Report ready',
        previewText: 'This is the real uploaded thyroid function test report, shown with a clean summary layout and the original PDF preview beside it.',
        meta: [
          { label: 'Registration', value: '06 Sep 2024 · 12:30 PM' },
          { label: 'Authenticated', value: '06 Sep 2024 · 03:39 PM' },
          { label: 'Printed', value: '06 Sep 2024 · 03:49 PM' },
          { label: 'Department', value: 'Biochemistry' },
          { label: 'Centre', value: 'Oasis Clinic and Diagnostic Center' },
          { label: 'Address', value: 'KWAKTA CRPF' }
        ],
        chips: ['Electrochemiluminescence (ECLIA)', 'Serum sample', 'Cobas e411'],
        values: [
          { testName: 'Triiodothyronine, Total (T3)', result: '1.55 ng/mL', range: '0.80 - 2.0' },
          { testName: 'Thyroxine, Total (T4)', result: '8.77 µg/dl', range: '5.1 - 14.1' },
          { testName: 'Thyroid Stimulating Hormone (TSH)', result: '0.82 µIU/ml', range: '0.27 - 4.2' }
        ],
        valuesNote: 'Values copied from the uploaded thyroid function test report. They are shown exactly for presentation use, without extra medical interpretation.'
      },
      {
        reportId: 'OAS-24031',
        accessCode: '4852',
        patientDob: '1998-07-12',
        patientName: 'Anjali Devi',
        test: 'Complete blood count',
        date: '27 Mar 2026',
        eta: 'Ready now',
        status: 'ready',
        pdfUrl: '',
        previewTitle: 'Summary ready',
        previewText: 'This is a simple database record with a summary only.',
        meta: [
          { label: 'Collected', value: '27 Mar 2026' },
          { label: 'Status', value: 'Ready' },
          { label: 'Report type', value: 'Summary only' },
          { label: 'Centre', value: 'Oasis Healthcare' }
        ],
        chips: ['Patient record', 'No PDF attached'],
        values: [
          { testName: 'Hemoglobin', result: '13.4 g/dL', range: '12.0 - 15.0' },
          { testName: 'Platelets', result: '2.7 lakh / cumm', range: '1.5 - 4.5' },
          { testName: 'WBC Count', result: '7,600 / cumm', range: '4,000 - 11,000' }
        ],
        valuesNote: 'This one stays as a simple database record.'
      },
      {
        reportId: 'OAS-24032',
        accessCode: '1148',
        patientDob: '1992-11-21',
        patientName: 'Rahul Singh',
        test: 'Thyroid profile',
        date: '27 Mar 2026',
        eta: 'Today · 6:30 PM',
        status: 'processing',
        pdfUrl: '',
        previewTitle: 'Processing update',
        previewText: 'This sample is still under review, so the page shows status and workflow progress instead of a final file.',
        meta: [
          { label: 'Collected', value: '27 Mar 2026' },
          { label: 'Current stage', value: 'Processing' },
          { label: 'Expected update', value: 'Today · 6:30 PM' },
          { label: 'Centre', value: 'Oasis Healthcare' }
        ],
        chips: ['Under review'],
        values: [],
        valuesNote: 'No final values are shown until the report is ready.'
      },
      {
        reportId: 'OAS-24033',
        accessCode: '7624',
        patientDob: '2001-03-08',
        patientName: 'Maria Chanu',
        test: 'Lipid profile',
        date: '28 Mar 2026',
        eta: 'Tomorrow · 10:00 AM',
        status: 'collected',
        pdfUrl: '',
        previewTitle: 'Collected sample',
        previewText: 'This sample has been collected and queued, so the page only shows the workflow and expected update.',
        meta: [
          { label: 'Collected', value: '28 Mar 2026' },
          { label: 'Current stage', value: 'Collected' },
          { label: 'Expected update', value: 'Tomorrow · 10:00 AM' },
          { label: 'Centre', value: 'Oasis Healthcare' }
        ],
        chips: ['Queued for lab'],
        values: [],
        valuesNote: 'Detailed values appear only once the report is processed and released.'
      }
    ];

    for (const item of demoReports) {
      await LabReport.findOneAndUpdate(
        { reportId: item.reportId },
        item,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return res.json({ message: 'Demo lab reports seeded successfully.' });
  } catch (error) {
    console.error('Seed demo lab reports failed:', error);
    return res.status(500).json({ message: 'Failed to seed demo lab reports.' });
  }
});

module.exports = router;
