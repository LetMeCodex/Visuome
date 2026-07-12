import React from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

export class WorkspaceErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("WorkspaceErrorBoundary caught rendering crash:", error, info);
    this.setState({ error, info });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, info: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 h-full flex flex-col items-center justify-center text-white bg-[#0f1015] select-none">
          <Card className="w-full max-w-lg border border-rose-500/50 p-6 space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <span className="text-xl">⚠️</span>
              <h3 className="text-sm font-bold uppercase tracking-wider">Workspace Error Card</h3>
            </div>
            
            <p className="text-xs text-[#a9b1d6]">
              A fatal rendering error occurred inside the active page view.
            </p>

            <div className="bg-[#14151f] p-3 rounded border border-[#2f3147] text-[10px] font-mono text-rose-300 max-h-32 overflow-y-auto">
              {String(this.state.error?.stack || this.state.error)}
            </div>

            <div className="flex space-x-3">
              <Button onClick={this.handleRetry} variant="primary">
                Retry Render
              </Button>
              <Button onClick={() => alert(JSON.stringify(this.state.info))} variant="secondary">
                View Diagnostics
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
export default WorkspaceErrorBoundary;
