import sys
from textual.app import App, ComposeResult
from textual.widgets import Header, Footer, Static, Input, Log
from textual.containers import Container, Horizontal, Vertical

class NovelAgentTUI(App):
    """A TUI for the Novel Agent."""
    
    CSS = """
    Screen {
        layout: vertical;
    }
    #main-container {
        height: 1fr;
    }
    #sidebar {
        width: 30;
        background: $panel;
        border-right: tall $primary;
    }
    #editor {
        width: 1fr;
        padding: 1;
    }
    #status-bar {
        height: 3;
        background: $accent;
        color: white;
        content-align: center middle;
    }
    """
    
    BINDINGS = [
        ("q", "quit", "Quit"),
        ("n", "new_chapter", "New Chapter"),
        ("s", "save", "Save"),
    ]

    def compose(self) -> ComposeResult:
        yield Header()
        with Horizontal(id="main-container"):
            yield Vertical(
                Static(" [ PROJECT BIBLE ] ", variant="bold"),
                Static("- Protagonist: Lee"),
                Static("- World: Neo-Seoul"),
                id="sidebar"
            )
            with Vertical(id="editor"):
                yield Static("--- Chapter 1: The Awakening ---\n\nThe neon lights of Neo-Seoul flickered...")
                yield Input(placeholder="Type commands or prose here...")
        yield Log(id="status-log")
        yield Footer()

if __name__ == "__main__":
    app = NovelAgentTUI()
    app.run()
