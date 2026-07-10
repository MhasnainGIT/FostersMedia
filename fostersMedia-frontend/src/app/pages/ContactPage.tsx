import { useState } from "react";
import { motion } from "motion/react";
import { useData } from "../context/DataContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Mail, Phone, MapPin, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export function ContactPage() {
  const { addEnquiry } = useData();

  // Influencer Form State
  const [infCompany, setInfCompany] = useState("");
  const [infContact, setInfContact] = useState("");
  const [infEmail, setInfEmail] = useState("");
  const [infPhone, setInfPhone] = useState("");
  const [infBudget, setInfBudget] = useState("");
  const [infType, setInfType] = useState("Product Launch");
  const [infMessage, setInfMessage] = useState("");

  // Event Form State
  const [evtCompany, setEvtCompany] = useState("");
  const [evtContact, setEvtContact] = useState("");
  const [evtEmail, setEvtEmail] = useState("");
  const [evtPhone, setEvtPhone] = useState("");
  const [evtBudget, setEvtBudget] = useState("");
  const [evtDate, setEvtDate] = useState("");
  const [evtMessage, setEvtMessage] = useState("");

  const handleInfluencerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infCompany || !infContact || !infEmail || !infPhone || !infBudget) return;

    addEnquiry({
      company: infCompany,
      contact: infContact,
      email: infEmail,
      phone: infPhone,
      budget: infBudget,
      campaignType: infType,
      message: infMessage || `Influencer collaboration inquiry.`
    });

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.75 },
      colors: ["#FF6A88", "#FF8E53", "#FFFFFF"]
    });

    toast.success("Request Submited Successfully!", {
      description: "Our campaign director will review and contact you shortly."
    });

    // Reset fields
    setInfCompany("");
    setInfContact("");
    setInfEmail("");
    setInfPhone("");
    setInfBudget("");
    setInfMessage("");
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtCompany || !evtContact || !evtEmail || !evtPhone || !evtBudget || !evtDate) return;

    addEnquiry({
      company: evtCompany,
      contact: evtContact,
      email: evtEmail,
      phone: evtPhone,
      budget: evtBudget,
      campaignType: "Event Management",
      message: `Preferred Event Date: ${evtDate}. Details: ${evtMessage}`
    });

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.75 },
      colors: ["#FF6A88", "#FF8E53", "#FFFFFF"]
    });

    toast.success("Event Request Logged!", {
      description: "Our events lead has received your request."
    });

    // Reset fields
    setEvtCompany("");
    setEvtContact("");
    setEvtEmail("");
    setEvtPhone("");
    setEvtBudget("");
    setEvtDate("");
    setEvtMessage("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative">
      {/* Background decoration */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[300px] bg-glow-radial rounded-full blur-[130px] opacity-30 pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 space-y-4"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gradient-rose">
          Let's <span className="text-gradient-accent">Connect</span>
        </h1>
        <p className="text-base text-white/50 max-w-xl mx-auto leading-relaxed">
          Ready to scale your brand presence? Fill out the inquiry forms below and get logged into our live database.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Info Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white tracking-wide border-b border-white/5 pb-3">
              Office HQ
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="w-5 h-5 text-[#FF6A88] flex-shrink-0 mt-0.5" />
                <div className="text-white/70 leading-relaxed">
                  <span className="font-bold text-white block">Fosters Media Group</span>
                  848 Fifth Avenue, Penthouse Level<br />
                  New York, NY 10019
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-5 h-5 text-[#FF6A88] flex-shrink-0" />
                <span className="text-white/70">partnerships@fostersmedia.com</span>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-5 h-5 text-[#FF6A88] flex-shrink-0" />
                <span className="text-white/70">+1 (555) 304-4500</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 border-white/5 bg-[#FF6A88]/5 space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-[#FF6A88]" />
              <span>Real-Time Processing</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Our platform operates on a live database synchronization network. Submitting this form pushes notifications directly to our operations panel instantly.
            </p>
          </div>
        </div>

        {/* Forms Main Column */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <Tabs defaultValue="influencer" className="w-full space-y-6">
              
              {/* Tab Selector Buttons */}
              <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/5 p-1 rounded-2xl">
                <TabsTrigger value="influencer" className="rounded-xl py-2.5 font-semibold text-sm">
                  Hire an Influencer
                </TabsTrigger>
                <TabsTrigger value="event" className="rounded-xl py-2.5 font-semibold text-sm">
                  Book an Event
                </TabsTrigger>
              </TabsList>

              {/* Hire Influencer Form */}
              <TabsContent value="influencer">
                <div className="glass-panel p-8 border-white/5 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                      Campaign Inquiry
                    </h2>
                    <p className="text-xs text-white/40">Request influencer placements, review alignments, or start partnerships.</p>
                  </div>

                  <form onSubmit={handleInfluencerSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          required
                          placeholder="Your Company"
                          value={infCompany}
                          onChange={(e) => setInfCompany(e.target.value)}
                          className="bg-white/5 border-white/5 rounded-xl h-10 placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="contact">Contact Representative</Label>
                        <Input
                          id="contact"
                          required
                          placeholder="Your Name"
                          value={infContact}
                          onChange={(e) => setInfContact(e.target.value)}
                          className="bg-white/5 border-white/5 rounded-xl h-10 placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          required
                          type="email"
                          placeholder="name@company.com"
                          value={infEmail}
                          onChange={(e) => setInfEmail(e.target.value)}
                          className="bg-white/5 border-white/5 rounded-xl h-10 placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          required
                          placeholder="+1 (555) 123-4567"
                          value={infPhone}
                          onChange={(e) => setInfPhone(e.target.value)}
                          className="bg-white/5 border-white/5 rounded-xl h-10 placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select value={infBudget} onValueChange={setInfBudget}>
                          <SelectTrigger className="bg-white/5 border-white/5 rounded-xl h-10 text-white">
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0B0C10] border-white/10 text-white">
                            <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                            <SelectItem value="$10,000 - $25,000">$10,000 - $25,000</SelectItem>
                            <SelectItem value="$25,000 - $50,000">$25,000 - $50,000</SelectItem>
                            <SelectItem value="$50,000 - $100,000">$50,000 - $100,000</SelectItem>
                            <SelectItem value="$100,000+">$100,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="campaign-type">Campaign Goal</Label>
                        <Select value={infType} onValueChange={setInfType}>
                          <SelectTrigger className="bg-white/5 border-white/5 rounded-xl h-10 text-white">
                            <SelectValue placeholder="Select objective" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0B0C10] border-white/10 text-white">
                            <SelectItem value="Product Launch">Product Launch</SelectItem>
                            <SelectItem value="Brand Awareness">Brand Awareness</SelectItem>
                            <SelectItem value="Influencer Campaign">Social Media Campaign</SelectItem>
                            <SelectItem value="Ongoing Partnership">Ongoing Ambassador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message">Campaign Message / Objective</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your brand goals, timelines, platforms, and demographics..."
                        value={infMessage}
                        onChange={(e) => setInfMessage(e.target.value)}
                        className="bg-white/5 border-white/5 rounded-xl min-h-[100px] placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white font-semibold rounded-xl h-11 shadow-lg shadow-[#FF6A88]/10">
                      Submit Campaign Request
                    </Button>
                  </form>
                </div>
              </TabsContent>

              {/* Book an Event Form */}
              <TabsContent value="event">
                <div className="glass-panel p-8 border-white/5 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                      Event Coordination Inquiry
                    </h2>
                    <p className="text-xs text-white/40">Inquire about launch ceremonies, guest coordinates, and celebrity appearances.</p>
                  </div>

                  <form onSubmit={handleEventSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="evt-company">Company Name</Label>
                        <Input
                          id="evt-company"
                          required
                          placeholder="Your Company"
                          value={evtCompany}
                          onChange={(e) => setEvtCompany(e.target.value)}
                          className="bg-white/5 border-white/5 rounded-xl h-10 placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="evt-contact">Contact Representative</Label>
                        <Input
                          id="evt-contact"
                          required
                          placeholder="Your Name"
                          value={evtContact}
                          onChange={(e) => setEvtContact(e.target.value)}
                          className="bg-white/5 border-white/5 rounded-xl h-10 placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="evt-email">Email</Label>
                        <Input
                          id="evt-email"
                          required
                          type="email"
                          placeholder="name@company.com"
                          value={evtEmail}
                          onChange={(e) => setEvtEmail(e.target.value)}
                          className="bg-white/5 border-white/5 rounded-xl h-10 placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="evt-phone">Phone Number</Label>
                        <Input
                          id="evt-phone"
                          required
                          placeholder="+1 (555) 123-4567"
                          value={evtPhone}
                          onChange={(e) => setEvtPhone(e.target.value)}
                          className="bg-white/5 border-white/5 rounded-xl h-10 placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="evt-budget">Estimated Budget</Label>
                        <Select value={evtBudget} onValueChange={setEvtBudget}>
                          <SelectTrigger className="bg-white/5 border-white/5 rounded-xl h-10 text-white">
                            <SelectValue placeholder="Estimated budget" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0B0C10] border-white/10 text-white">
                            <SelectItem value="$25,000 - $50,000">$25,000 - $50,000</SelectItem>
                            <SelectItem value="$50,000 - $100,000">$50,000 - $100,000</SelectItem>
                            <SelectItem value="$100,000 - $250,000">$100,000 - $250,000</SelectItem>
                            <SelectItem value="$250,000+">$250,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="evt-date">Target Event Date</Label>
                        <Input
                          id="evt-date"
                          required
                          type="date"
                          value={evtDate}
                          onChange={(e) => setEvtDate(e.target.value)}
                          className="bg-white/5 border-white/5 rounded-xl h-10 text-white focus:border-[#FF6A88]/50 block w-full"
                          style={{ colorScheme: "dark" }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="evt-message">Brief Description of the Event</Label>
                      <Textarea
                        id="evt-message"
                        placeholder="Tell us about the venue preference, list size, guest stars, and styling tone..."
                        value={evtMessage}
                        onChange={(e) => setEvtMessage(e.target.value)}
                        className="bg-white/5 border-white/5 rounded-xl min-h-[100px] placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white font-semibold rounded-xl h-11 shadow-lg shadow-[#FF6A88]/10">
                      Submit Event request
                    </Button>
                  </form>
                </div>
              </TabsContent>

            </Tabs>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
