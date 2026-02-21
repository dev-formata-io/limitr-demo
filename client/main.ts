import { Limitr } from '@formata/limitr';
import { LitElement, html, css, CSSResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { initStof } from '@formata/stof';
import '@formata/limitr-ui';
// @ts-ignore
import stofWasm from '@formata/stof/wasm?url';
await initStof(stofWasm);

type ChatMessage = {
    role: 'user' | 'ai';
    text: string;
};

@customElement('app-main')
export class AppMain extends LitElement {
    @property({ type: Object })
    private policy?: Limitr;

    @state()
    private customerId: string = 'demo_user';

    @state()
    private selectedTokens: number = 1000;

    @state()
    private showPricingTables: boolean = false;

    @state()
    private chatMessages: ChatMessage[] = [
        { role: 'ai', text: '👋 Welcome to the Mock AI demo.' },
        { role: 'ai', text: 'Select token usage below to simulate an AI response.' }
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

        .chat-header {
            margin-bottom: 1.5rem;
        }

        .chat-header-label {
            display: inline-block;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #ffffff;
            background: #000000;
            padding: 0.2rem 0.55rem;
            border-radius: 3px;
            margin-bottom: 0.5rem;
        }

        .chat-header h1 {
            font-size: 1.6rem;
            font-weight: 700;
            margin: 0 0 0.25rem 0;
            line-height: 1.2;
        }

        .chat-header p {
            font-size: 0.85rem;
            color: #666666;
            margin: 0;
        }

        .chat-section {
            margin-bottom: 3rem;
        }

        /* Chat window */
        .chat-window {
            background: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 12px 12px 0 0;
            padding: 1.25rem;
            height: 350px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        /* Each row aligns the bubble + avatar */
        .message-row {
            display: flex;
            align-items: flex-end;
            gap: 0.5rem;
        }

        .message-row.user {
            flex-direction: row-reverse;
        }

        /* Small avatar circle */
        .avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.03em;
            text-transform: uppercase;
        }

        .avatar.ai {
            background: #000000;
            color: #ffffff;
        }

        .avatar.user {
            background: #e0e0e0;
            color: #000000;
        }

        /* The bubble itself */
        .bubble {
            max-width: 70%;
            padding: 0.6rem 0.9rem;
            border-radius: 16px;
            font-size: 0.875rem;
            line-height: 1.5;
        }

        .message-row.ai .bubble {
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-bottom-left-radius: 4px;
            color: #000000;
        }

        .message-row.user .bubble {
            background: #000000;
            border: 1px solid #000000;
            border-bottom-right-radius: 4px;
            color: #ffffff;
        }

        /* Composer bar — sits flush below the chat window */
        .composer {
            display: flex;
            align-items: center;
            gap: 0;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 12px 12px;
            background: #ffffff;
            overflow: hidden;
        }

        .composer-input {
            flex: 1;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            color: #aaaaaa;
            border: none;
            outline: none;
            background: transparent;
            cursor: default;
            font-family: system-ui, sans-serif;
        }

        .composer-divider {
            width: 1px;
            height: 1.5rem;
            background: #e0e0e0;
            flex-shrink: 0;
        }

        .composer-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 0.75rem;
        }

        select {
            padding: 0.4rem 0.5rem;
            border-radius: 4px;
            border: 1px solid #d0d0d0;
            font-size: 0.825rem;
            background: #f5f5f5;
            color: #000000;
            cursor: pointer;
        }

        button {
            padding: 0.45rem 1.1rem;
            background: #000000;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.825rem;
            cursor: pointer;
            white-space: nowrap;
        }

        button:hover {
            opacity: 0.85;
        }

        .pricing-section {
            margin-top: 3rem;
        }
        `;
    }

    updated(changedProps: Map<string, unknown>) {
        if (changedProps.has('chatMessages')) {
            this.scrollToBottom();
        }
    }

    private scrollToBottom() {
        const chatWindow = this.shadowRoot?.querySelector('.chat-window');
        if (chatWindow) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }

    async connectedCallback() {
        super.connectedCallback();
        this.policy = await Limitr.cloud({ token: 'lmlive_W80FjPoWoiUWY3EGhojcJjAQQSaJ' });
        await this.policy?.addCloudCustomer(this.customerId);
        if (this.policy && !await this.policy.allow(this.customerId, 'unlimited')) {
            this.showPricingTables = true;
        }
        this.requestUpdate();
    }

    render() {
        return html`
            <div class="container">
                <div class="chat-header">
                    <span class="chat-header-label">Mock Demo</span>
                    <h1>AI Chat Feature</h1>
                    <p>Simulated AI responses — select a token amount and hit Send to try it out.</p>
                </div>

                <div class="chat-section">
                    <div class="chat-window">
                        ${this.chatMessages.map(msg => html`
                            <div class="message-row ${msg.role}">
                                <div class="avatar ${msg.role}">${msg.role === 'ai' ? 'AI' : 'You'}</div>
                                <div class="bubble">${msg.text}</div>
                            </div>
                        `)}
                    </div>

                    <div class="composer">
                        <input
                            class="composer-input"
                            type="text"
                            placeholder="Type a message... (simulated)"
                            disabled
                        />
                        <div class="composer-divider"></div>
                        <div class="composer-controls">
                            <select @change=${(e: Event) => this.selectedTokens = parseInt((e.target as HTMLSelectElement).value)}>
                                <option value="1000">1,000 tokens</option>
                                <option value="2000">2,000 tokens</option>
                                <option value="5000">5,000 tokens</option>
                                <option value="10000">10,000 tokens</option>
                            </select>
                            <button @click=${this.sendTokens}>Send</button>
                        </div>
                    </div>
                </div>

                <div class="pricing-section">
                    ${this.showPricingTables ? html`<limitr-current-plan
                        .policy=${this.policy}
                        .customerId=${this.customerId}
                        ?showStripeInfo=${false}
                        ?cancelImmediately=${true}
                        ?requestStripeInvoices=${false}
                        ?requestStripePortalUrl=${false}
                    ></limitr-current-plan>` : nothing }
                </div>
            </div>
        `;
    }

    private async sendTokens() {
        // Immediately show the user's "message" (the token count they picked)
        this.chatMessages = [
            ...this.chatMessages,
            { role: 'user', text: `Send ${this.selectedTokens} tokens` }
        ];

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
                    { role: 'ai', text: 'Network error contacting server.' }
                ];
            } else {
                const data = await response.json();
                this.chatMessages = [
                    ...this.chatMessages,
                    { role: 'ai', text: data.message }
                ];
            }
        } catch (error) {
            this.chatMessages = [
                ...this.chatMessages,
                { role: 'ai', text: `Error: ${error}` }
            ];
        }
    }
}
