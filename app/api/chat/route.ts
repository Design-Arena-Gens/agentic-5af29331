import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    // Advanced AI agent logic that handles various tasks
    const lastMessage = messages[messages.length - 1]
    const userInput = lastMessage.content.toLowerCase()

    let response = ''

    // Task detection and handling
    if (userInput.includes('calculate') || userInput.includes('math') || /\d+[\+\-\*\/]\d+/.test(userInput)) {
      response = handleCalculation(lastMessage.content)
    } else if (userInput.includes('code') || userInput.includes('program') || userInput.includes('function')) {
      response = handleCodeRequest(lastMessage.content)
    } else if (userInput.includes('translate')) {
      response = handleTranslation(lastMessage.content)
    } else if (userInput.includes('schedule') || userInput.includes('plan') || userInput.includes('organize')) {
      response = handlePlanning(lastMessage.content)
    } else if (userInput.includes('write') || userInput.includes('create') || userInput.includes('generate')) {
      response = handleContentCreation(lastMessage.content)
    } else if (userInput.includes('analyze') || userInput.includes('data')) {
      response = handleAnalysis(lastMessage.content)
    } else if (userInput.includes('help') || userInput.includes('how')) {
      response = handleHelpRequest(lastMessage.content)
    } else {
      response = handleGeneralQuery(lastMessage.content)
    }

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

function handleCalculation(input: string): string {
  try {
    // Extract and evaluate mathematical expressions
    const mathMatch = input.match(/(\d+\.?\d*)\s*([\+\-\*\/])\s*(\d+\.?\d*)/)
    if (mathMatch) {
      const [_, num1, operator, num2] = mathMatch
      const a = parseFloat(num1)
      const b = parseFloat(num2)
      let result = 0
      switch (operator) {
        case '+': result = a + b; break
        case '-': result = a - b; break
        case '*': result = a * b; break
        case '/': result = b !== 0 ? a / b : NaN; break
      }
      return `The calculation result is: ${result}\n\nI can help you with more complex calculations, statistical analysis, or data processing. Just ask!`
    }
    return `I can help you with calculations! Try asking me to:\n• Perform arithmetic operations\n• Calculate percentages\n• Solve equations\n• Analyze numerical data\n\nWhat specific calculation do you need?`
  } catch (error) {
    return 'I encountered an error with that calculation. Could you rephrase it?'
  }
}

function handleCodeRequest(input: string): string {
  const examples = {
    python: `Here's a Python example:

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
\`\`\`

I can help you with:
• Writing functions and classes
• Debugging code
• Optimizing algorithms
• Explaining code concepts
• Creating full applications`,

    javascript: `Here's a JavaScript example:

\`\`\`javascript
// Async function to fetch data
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
\`\`\`

I can assist with modern JavaScript, React, Node.js, and more!`
  }

  if (input.toLowerCase().includes('python')) {
    return examples.python
  } else if (input.toLowerCase().includes('javascript') || input.toLowerCase().includes('js')) {
    return examples.javascript
  }

  return `I can help you with code in multiple languages:

• Python - Data science, automation, web development
• JavaScript/TypeScript - Web apps, Node.js, React
• HTML/CSS - Frontend design
• SQL - Database queries
• And many more!

What programming task can I help you with?`
}

function handleTranslation(input: string): string {
  return `I can help with language translation tasks!

While I can't perform real-time translation in this demo, I can:
• Explain language concepts
• Help with grammar and syntax
• Provide common phrases
• Assist with language learning

What languages are you working with?`
}

function handlePlanning(input: string): string {
  return `I can help you plan and organize tasks!

Here's a sample task breakdown approach:

1. **Define Goals** - What do you want to achieve?
2. **Break Down Tasks** - Divide into manageable steps
3. **Set Priorities** - Order by importance and urgency
4. **Allocate Time** - Estimate duration for each task
5. **Track Progress** - Monitor completion and adjust

I can help you:
• Create project plans
• Organize daily schedules
• Set up workflows
• Prioritize tasks
• Develop strategies

What would you like to plan or organize?`
}

function handleContentCreation(input: string): string {
  if (input.toLowerCase().includes('email')) {
    return `Here's a professional email template:

**Subject:** [Clear, Concise Subject Line]

Dear [Recipient Name],

I hope this message finds you well. I'm reaching out regarding [purpose of email].

[Main content - be clear and concise]

I would appreciate [specific request or action needed].

Thank you for your time and consideration.

Best regards,
[Your Name]

I can help you create:
• Business emails
• Creative content
• Reports and documentation
• Marketing copy
• Social media posts

What would you like me to help you write?`
  }

  return `I can help you create various types of content:

• Professional emails and letters
• Blog posts and articles
• Marketing copy
• Social media content
• Technical documentation
• Creative writing
• Presentations
• Reports and summaries

What type of content do you need?`
}

function handleAnalysis(input: string): string {
  return `I can help you analyze data and information!

**Analysis Capabilities:**

📊 **Data Analysis**
• Statistical analysis
• Trend identification
• Pattern recognition
• Data interpretation

🔍 **Research Analysis**
• Information synthesis
• Comparative analysis
• Critical evaluation
• Summary generation

💡 **Decision Support**
• Pros and cons evaluation
• Risk assessment
• Option comparison
• Recommendation generation

What would you like me to analyze?`
}

function handleHelpRequest(input: string): string {
  return `I'm here to help! Here's what I can do for you:

🤖 **Core Capabilities:**

1. **Information & Research**
   - Answer questions on various topics
   - Explain complex concepts
   - Provide detailed information

2. **Problem Solving**
   - Analytical thinking
   - Creative solutions
   - Step-by-step guidance

3. **Content Creation**
   - Writing assistance
   - Editing and proofreading
   - Content generation

4. **Technical Tasks**
   - Code writing and debugging
   - Algorithm explanation
   - Technical documentation

5. **Planning & Organization**
   - Task management
   - Project planning
   - Time optimization

What specific task can I help you with?`
}

function handleGeneralQuery(input: string): string {
  const responses = [
    `I understand you're asking about: "${input.substring(0, 100)}${input.length > 100 ? '...' : ''}"

Let me help you with that. Based on your query, I can provide information, assistance, or guidance. Could you provide more specific details about what you need?

I'm capable of:
• Answering questions with detailed explanations
• Providing step-by-step guidance
• Offering multiple perspectives
• Creating actionable plans
• Solving complex problems

How can I best assist you with this?`,

    `Thank you for your question! I'm analyzing: "${input.substring(0, 100)}${input.length > 100 ? '...' : ''}"

As your AI agent assistant, I can approach this in several ways:

1. **Direct Answer** - Provide immediate information
2. **Detailed Explanation** - Break down the concept
3. **Practical Examples** - Show real-world applications
4. **Step-by-Step Guide** - Walk through the process

Which approach would be most helpful for you?`,

    `I'm here to help with: "${input.substring(0, 100)}${input.length > 100 ? '...' : ''}"

Let me provide a comprehensive response. I can assist with:

✓ Research and information gathering
✓ Problem-solving and analysis
✓ Creative and technical tasks
✓ Planning and execution strategies
✓ Learning and skill development

What specific aspect would you like me to focus on?`
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}
