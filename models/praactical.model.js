import { Schema, model } from '../database/connection';

// 1. Defining Schemas for different Users of the System. (a) Administrator (b) Faculty (c) Student
// User schema
const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    role: String
});

const User = model('User', userSchema);

// Administrator schema
const administratorSchema = new Schema({
    role: { type: String, default: 'administrator' }
});

const Administrator = User.discriminator('Administrator', administratorSchema);

// Faculty Specialization schema
const facultySpecializationSchema = new Schema({
    domain: {type: String}
});

const FacultySpecialization = model('FacultySpecialization', facultySpecializationSchema);

// Faculty schema
const facultySchema = new Schema({
    designation: String,
    roles: [String],
    specializations: [{ type: Schema.Types.ObjectId, ref: 'FacultySpecialization' }]
});

const Faculty = User.discriminator('Faculty', facultySchema);

// Student schema
const studentSchema = new Schema({
    regNumber: String,
    batch: String,
    contact: String
});

const Student = User.discriminator('Student', studentSchema);

// 1. End of User Schemas
// -------------------------------------------------------------------------------------


// 2. Let's define schemas that can be independently stored in the database. (a) Project Domains (b) Rubrics (c) Presentations

// Project Domain schema
const projectDomainSchema = new Schema({
    domainName: String
});

const ProjectDomain = model('ProjectDomain', projectDomainSchema);

// Rubric schema
const rubricSchema = new Schema({
    rubricName: String,
    mappedToPLO: String,
    maxScore: Number,
    academicYear: Date
});

const Rubric = model('Rubric', rubricSchema);

// Presentations schema
const presentationSchema = new Schema({
    pId: String, // will generally be of the form P-1, P-2, P-3, etc.
    title: String,
    weightage: Number, // weightage of this presentation in the final evaluation / 100
    academicYear: Date
});

const Presentation = model('Presentation', presentationSchema);

const venueSchema = new Schema({
    venueName: String,
    location: String
});

const Venue = model('Venue', venueSchema);

// 2. End of independent schemas
// -------------------------------------------------------------------------------------


// 3. Now, let's define schemas that are dependent on other schemas. (a) Panel (b) FYP Group (c) PresentationSchedule (d) Evaluation  (e) PresentationEvaluation

// Panel schema
const panelSchema = new Schema({
    panelId: String,    // will generally be of the type A, B, C, etc.
    academicYear: Date,
    facultyMembers: [{ type: Schema.Types.ObjectId, ref: 'Faculty' }]
});

const Panel = model('Panel', panelSchema);

// FYP Group schema
const fypGroupSchema = new Schema({
    groupId: String, // will generally be of the form A-1, B-2, C-3, etc. the first letter is the panelId
    projectName: String,
    projectDomains: [{ type: Schema.Types.ObjectId, ref: 'ProjectDomain' }],
    academicYear: Date,
    advisor: {
        faculty: { type: Schema.Types.ObjectId, ref: 'Faculty' },
        status: { type: String, enum: ['accepted', 'pending'] }
    },
    coAdvisors: [{
        faculty: { type: Schema.Types.ObjectId, ref: 'Faculty' },
        status: { type: String, enum: ['accepted', 'pending'] }
    }],
    students: [{
        student: { type: Schema.Types.ObjectId, ref: 'Student' },
        status: { type: String, enum: ['accepted', 'pending'] }
    }],
    status: { type: String, enum: ['pending', 'not-approved', 'approved'] },
    comments: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        comment: String
    }]
});

const FYPGroup = model('FYPGroup', fypGroupSchema);

// PresentationSchedule schema
const presentationScheduleSchema = new Schema({
    pId: { type: Schema.Types.ObjectId, ref: 'Presentation'},
    date: Date, // Date on which a presentation is scheduled
    academicYear: Date,
    venue: { type: Schema.Types.ObjectId, ref: 'Venue'},
    panel: { type: Schema.Types.ObjectId, ref: 'Panel' },
    slots: [{
        startTime: Date,
        endTime: Date,
        fypGroup: { type: Schema.Types.ObjectId, ref: 'FYPGroup' }
    }]
});

const PresentationSchedule = model('PresentationSchedule', presentationScheduleSchema);

// Evaluation schema
const evaluationSchema = new Schema({
    presentation: { type: Schema.Types.ObjectId, ref: 'Presentation' },
    groupId: { type: Schema.Types.ObjectId, ref: 'FYPGroup' },
    evaluatorId: { type: Schema.Types.ObjectId, ref: 'Faculty' },
    rubricId: { type: Schema.Types.ObjectId, ref: 'Rubric' },
    marks: Number
});

const Evaluation = model('Evaluation', evaluationSchema);

// Presentation Evaluation schema
const presentationEvaluationSchema = new Schema({
    presentation: { type: Schema.Types.ObjectId, ref: 'Presentation' },
    evaluationYear: Date,
    evaluations: [evaluationSchema]
});

const PresentationEvaluation = model('PresentationEvaluation', presentationEvaluationSchema);

// 3. End of dependent schemas
// -------------------------------------------------------------------------------------

// Export all models
export default {
    User,
    Administrator,
    FacultySpecialization,
    Faculty,
    Student,
    ProjectDomain,
    Rubric,
    Presentation,
    Venue,
    Panel,
    FYPGroup,
    PresentationSchedule,
    Evaluation,
    PresentationEvaluation
};