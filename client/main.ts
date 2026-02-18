import { Limitr } from '@formata/limitr';
import { LitElement, html, css, CSSResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { initStof } from '@formata/stof';
import '@formata/limitr-ui';
// @ts-ignore
import stofWasm from '@formata/stof/wasm?url';
await initStof(stofWasm);

@customElement('app-main')
export class AppMain extends LitElement {
    @property({ type: Object })
    private policy?: Limitr;

    @state()
    private customerId: string = 'demo_user';

    @state()
    private selectedTokens: number = 1000;

    @state()
    private chatMessages: string[] = [
        '👋 Welcome to the Mock AI demo.',
        'Select token usage below to simulate an AI response.'
    ];

    static get styles(): CSSResult {
        return css`
        :host {
            display: block;
            min-height: 100vh;
            background: #ffffff;
            color: #000000;
            font-family: system-ui, sans-serif;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
        }

        h1 {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 2rem;
        }

        .chat-section {
            margin-bottom: 3rem;
        }

        .chat-window {
            background: #f5f5f5;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1rem;
            height: 350px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .chat-message {
            background: #ffffff;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            border: 1px solid #e5e5e5;
            font-size: 0.9rem;
        }

        .controls {
            display: flex;
            gap: 0.75rem;
            margin-top: 1rem;
        }

        select {
            padding: 0.5rem;
            border-radius: 4px;
            border: 1px solid #d0d0d0;
            font-size: 0.9rem;
        }

        button {
            padding: 0.5rem 1.25rem;
            background: #000000;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            font-weight: 500;
            cursor: pointer;
        }

        button:hover {
            opacity: 0.85;
        }

        .pricing-section {
            margin-top: 3rem;
        }
        `;
    }

    async connectedCallback() {
        super.connectedCallback();
        this.policy = await Limitr.cloud({ token: 'lmlive_W80FjPoWoiUWY3EGhojcJjAQQSaJ' });
        await this.policy?.addCloudCustomer(this.customerId);
        this.requestUpdate();
    }

    render() {
        return html`
            <div class="container">
                <h1>Limitr AI Token Demo</h1>
                <div class="chat-section">
                    <div class="chat-window">
                        ${this.chatMessages.map(msg => html`<div class="chat-message">${msg}</div>`)}
                    </div>
                    <div class="controls">
                        <select @change=${(e: Event) => this.selectedTokens = parseInt((e.target as HTMLSelectElement).value)}>
                            <option value="1000">1000 tokens</option>
                            <option value="2000">2000 tokens</option>
                            <option value="5000">5000 tokens</option>
                            <option value="10000">10000 tokens</option>
                        </select>
                        <button @click=${this.sendTokens}>
                            Send
                        </button>
                    </div>
                </div>

                <div class="pricing-section">
                    <limitr-current-plan
                        .policy=${this.policy}
                        .customerId=${this.customerId}
                        ?showStripeInfo=${false}
                        ?cancelImmediately=${true}
                        ?requestStripeInvoices=${false}
                        ?requestStripePortalUrl=${false}
                    ></limitr-current-plan>
                </div>
            </div>
        `;
    }

    private async sendTokens() {
        try {
            const response = await fetch('http://localhost:3000/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: this.customerId,
                    value: this.selectedTokens
                })
            });
            if (!response.ok) {
                this.chatMessages = [
                    ...this.chatMessages,
                    'Network error contacting server.'
                ];
            } else {
                const data = await response.json();
                this.chatMessages = [
                    ...this.chatMessages,
                    data.message
                ];
            }
        } catch (error) {
            this.chatMessages = [
                ...this.chatMessages,
                `Error: ${error}`
            ];
        }
    }
}
