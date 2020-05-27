import { Submission, Form } from '@prisma/client';
import { elastic } from '../Elastic';
import { Service } from '@tsed/di';

@Service()
export class ElasticService {
  async indexSubmission(submission: Submission, formId: string) {
    await elastic.index({
      index: 'submissions',
      body: {
        id: submission.id,
        formId: formId,
        data: JSON.parse(submission.data),
      },
    });
  }

  async deleteFormIndexes(formId: string) {
    await elastic.deleteByQuery({ index: 'submissions', body: { query: { match: { formId } } } });
  }

  async deleteSubmissionIndex(submissionId: number) {
    await elastic.deleteByQuery({ index: 'submissions', body: { query: { match: { id: submissionId } } } });
  }
}