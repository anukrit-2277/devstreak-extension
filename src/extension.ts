import * as vscode from 'vscode';
import axios from 'axios';
export function activate(context: vscode.ExtensionContext) {

	console.log('Extension is now active!');
	let disposable = vscode.commands.registerCommand('devstreak.sendSnippet', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('Open a file and select code to send!');
      return;
    }

    // Get selected text or whole file if nothing selected
    const snippet = editor.document.getText(editor.selection).trim() || editor.document.getText().trim();
    if (!snippet) {
      vscode.window.showWarningMessage('No code found to send.');
      return;
    }

    vscode.window.showInformationMessage('Sending code snippet to DevStreak Backend API...');

    try {
      const response = await axios.post('http://localhost:5011/', {
        code: snippet
      }, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'API_KEY', // 
        }
      });

      if (response.data && response.data.summary) {
        vscode.window.showInformationMessage('Summary received! Opening preview...');
        // Open new tab with summary
        const doc = await vscode.workspace.openTextDocument({
          content: response.data.summary,
          language: 'markdown'  // or plaintext
        });
        vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
      } else {
        vscode.window.showErrorMessage('Backend did not return a summary.');
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error sending snippet: ${error.message}`);
    }
  });

  context.subscriptions.push(disposable);

	
}

export function deactivate() {}
