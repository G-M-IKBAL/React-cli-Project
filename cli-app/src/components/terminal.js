// src/components/Terminal.js

import React, { useState, useEffect, useRef } from 'react'
import './terminal.css' // Assuming there is a corresponding CSS file
import { processCommand } from '../services/commandService'
import FileUpload from './FileUploader'

// Import other necessary hooks and components
import SimpleLineChart from '../services/chartService'

const Terminal = () => {
  const [input, setInput] = useState('')
  
  const [output, setOutput] = useState(['Type "help" for a list of available commands.']);

  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  const [chartData, setChartData] = useState([])
  const [showChart, setShowChart] = useState(false)
  const [chartVisible, setChartVisible] = useState(true);

  // useEffect(() => {
  // inputRef.current?.focus();
  // }, []);

  useEffect(() => {
    if (inputRef.current && inputRef.current.focus) {
      inputRef.current.focus() 
    }
  }, [])

  useEffect(() => {
    if (inputRef.current && inputRef.current.focus) {
      fileInputRef.current.focus() 
    }
  }, [])


  // const handleChartSuccess = (data) => {
  //   setOutput(prevOutput => [...prevOutput, 
  //     { type: 'chart', content: <SimpleLineChart data={data} /> },
  //     { type: 'text', content: 'Chart drawn successfully.' }
  //   ]);
  // };

  const handleCommand = async (command) => {
    setOutput((prevOutput) => [...prevOutput, `>> ${command}`])

    if (command.startsWith('upload')) {
      fileInputRef.current.click()
      // Handle file upload...
      //setOutput((prevOutput) => [...prevOutput, 'Processing...'])
    }

      if (command.startsWith('draw')) {
      setOutput((prevOutput) => [...prevOutput, 'Drawing Chart On [file]...'])
      const args = command.split(' ')
      const fileName = args[1]
      const columns = args[2].split(',')

      try {
        const response = await fetch('http://localhost:3000/draw-chart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName, columns }),
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        setChartData(data)
        setShowChart(true)

        setOutput((prevOutput) => [...prevOutput, 'Chart drawn successfully.'])

      } catch (error) {
        console.error('Error:', error)
        setOutput((prevOutput) => [
          ...prevOutput,
          `Error drawing chart: ${error.message}`,
        ])
      }
    } 
    
    if (command.startsWith('delete')) {

      const args = command.split(' ')
      const fileName = args[1]

      try {
        const response = await fetch('http://localhost:3000/delete-file', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({fileName}),
        });
    
        if (response.ok) {
          setOutput((prevOutput) => [...prevOutput, 'File deleted successfully'])
          
        } else {
          
          setOutput((prevOutput) => [...prevOutput, 'Failed to delete the file'])
        }
      } catch (error) {
        console.error('Error:', error);
      }

    }
    
    else {
      // Handle other commands using processCommand from commandService...
      try {
        const result = await processCommand(command)
        setOutput((prevOutput) => [...prevOutput, ...result])
      } catch (error) {
        console.error('Error:', error)
        setOutput((prevOutput) => [...prevOutput, 'Error processing command.'])
      }
    }
    setInput('')
  }

  //fille handleing code here
  const handleFileSelectSuccess = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.text()
      // alert('File uploaded successfully: ' + result);

      setOutput((prevOutput) => [
        ...prevOutput,
        ['File uploaded successfully.'],
      ])
    } catch (error) {
      console.error('Error during file upload:', error)
      // alert('Error during file upload: ' + error.message);
      setOutput((prevOutput) => [...prevOutput, ['File Fail to Upload']])
    }
    console.log(`Selected file: ${file.name}`)
  }

  const handleFileSelectError = (error) => {
    console.error(`File selection error: ${error}`)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input)

      setInput('')
    }
  }

  const terminalHeader = `
  
 
                                                                              
  `
  return (
    <div className="terminal">
   <pre className="terminal-header">{terminalHeader}

      <div className="terminal-content">
        {output.map((line, index) => (
          <div key={index} className="terminal-line">{line}</div>
        ))}
  
        <div className="terminal-input-line">
       
          <span className="terminal-prompt">{'> '}</span>
          
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="terminal-input"
          />
          
          <FileUpload
            ref={fileInputRef}
            onFileSelectSuccess={handleFileSelectSuccess}
            onFileSelectError={handleFileSelectError}
          />

        </div>
      </div>
      
      {showChart && <SimpleLineChart data={chartData} />}
      </pre> 
    </div>

   
  );
}

export default Terminal
