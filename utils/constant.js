const MessageRole = {
    USER: "USER",
    AI: "AI"
};

const MAX_MESSAGES_IN_CACHE = 10

const ScenarioId = {
    INTERVIEW: "job-interview",
    SCHOOL: "school",
    FRIENDSHIP: "friendship",
    EMOTION: "emotion",
    DAILY_LIFE: "daily-life",
    COMMUNICATION: "communication",
    SHOPPING: "shopping",
}

const ScenarioTopics = {
    "job-interview": [
        {
            title: "Introducing yourself professionally",
            description: "Practice giving a short, confident introduction during an interview. Share your name, background, and interests in a job-friendly way."
        },
        {
            title: "Describing your strengths with examples",
            description: "Talk about your strengths and give real examples of when you used them successfully."
        },
        {
            title: "Answering 'Tell me about a challenge you overcame'",
            description: "Explain a problem you faced and how you solved it to show resilience and problem-solving."
        },
        {
            title: "Explaining why you're a good fit for this job",
            description: "Practice explaining how your skills match the job you're applying for."
        },
        {
            title: "Asking thoughtful questions at the end of an interview",
            description: "Prepare polite, smart questions to ask the interviewer to show you're interested and prepared."
        }
    ],
    "school": [
        {
            title: "Meeting a new classmate during lunch",
            description: "Practice introducing yourself and making small talk with someone sitting near you in the cafeteria."
        },
        {
            title: "Asking the teacher for help after class",
            description: "Learn how to politely ask your teacher questions when you're confused or need support."
        },
        {
            title: "Joining a group project and offering your ideas",
            description: "Practice joining a team and contributing your thoughts respectfully and clearly."
        },
        {
            title: "Starting small talk before class begins",
            description: "Learn how to talk casually with classmates before class starts to build connections."
        },
        {
            title: "Resolving a disagreement with a classmate politely",
            description: "Practice expressing your point of view calmly and finding a solution when you disagree."
        }
    ],
    "friendship": [
        {
            title: "Inviting a classmate to hang out after school",
            description: "Learn how to casually ask a friend to spend time together outside of school."
        },
        {
            title: "Starting a conversation at a birthday party",
            description: "Practice saying hello, introducing yourself, and making conversation at a social event."
        },
        {
            title: "Apologizing to a friend after a misunderstanding",
            description: "Learn how to say sorry and rebuild trust in a friendship after a disagreement."
        },
        {
            title: "Talking to someone who seems upset",
            description: "Practice checking in with a friend who looks sad or stressed in a caring and respectful way."
        },
        {
            title: "Expressing appreciation to a friend",
            description: "Learn how to tell a friend you're thankful for their support or kindness."
        }
    ],
    "emotion": [
        {
            title: "Explaining that you're feeling overwhelmed",
            description: "Practice telling someone when things feel too much and asking for a break or help."
        },
        {
            title: "Describing what makes you happy",
            description: "Share something that brings you joy and practice expressing positive emotions."
        },
        {
            title: "Telling someone you feel left out",
            description: "Learn how to express that you want to be included without blaming others."
        },
        {
            title: "Sharing your feelings without blaming others",
            description: "Practice using 'I' statements to express emotions clearly and respectfully."
        },
        {
            title: "Letting someone know you need space",
            description: "Practice politely asking for time alone when you're feeling overwhelmed or upset."
        }
    ],
    "daily life": [
        {
            title: "Ordering food at a fast-food restaurant",
            description: "Practice asking for what you want, responding to the cashier, and saying thank you."
        },
        {
            title: "Asking for help in a grocery store",
            description: "Learn how to ask an employee where to find an item or how to read a label."
        },
        {
            title: "Scheduling an appointment on the phone",
            description: "Practice calling a clinic or office to set up a time for a visit using polite and clear language."
        },
        {
            title: "Greeting your neighbor in the hallway",
            description: "Learn how to say hello and make light conversation with a neighbor."
        },
        {
            title: "Explaining a problem to a receptionist",
            description: "Practice calmly describing a situation and asking for help or clarification."
        }
    ],
    "communication": [
        {
            title: "Starting a conversation with someone new",
            description: "Practice greetings and small talk with someone you don't know well."
        },
        {
            title: "Changing topics politely in a conversation",
            description: "Learn how to shift the conversation naturally when it gets uncomfortable or stuck."
        },
        {
            title: "Saying no respectfully",
            description: "Practice turning down an offer or invitation in a polite, honest way."
        },
        {
            title: "Telling someone you don't understand politely",
            description: "Learn how to ask for clarification without feeling embarrassed."
        },
        {
            title: "Ending a conversation naturally",
            description: "Practice saying goodbye or signaling a conversation is over in a kind way."
        }
    ],
    "shopping": [
        {
            title: "Asking a store employee for help finding an item",
            description: "Practice approaching an employee and explaining what you need."
        },
        {
            title: "Politely declining help from a salesperson",
            description: "Learn how to say no to an offer without sounding rude."
        },
        {
            title: "Explaining you want to return an item",
            description: "Practice describing the issue and asking to return or exchange something."
        },
        {
            title: "Asking if there's a discount available",
            description: "Learn how to ask politely about deals or coupons at checkout."
        },
        {
            title: "Making small talk while checking out at the cashier",
            description: "Practice light conversation like saying 'Hi', 'How's your day?', and 'Thank you'."
        }
    ]
};    
  
module.exports = { MessageRole, MAX_MESSAGES_IN_CACHE };
  