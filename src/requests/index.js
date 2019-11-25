import aminoacidsequenceQueries from './aminoacidsequence'
import individualQueries from './individual'
import sequencingExperimentQueries from './sequencingExperiment'
import transcript_countQueries from './transcript_count'
import roleQueries from './role'
import userQueries from './user'

export default {
  aminoacidsequence: aminoacidsequenceQueries,
  individual: individualQueries,
  sequencingExperiment: sequencingExperimentQueries,
  transcript_count: transcript_countQueries,
  role: roleQueries,
  user: userQueries,
}
