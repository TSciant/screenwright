# ScreenWright Vision

## What is ScreenWright?

**ScreenWright** is a modular, emotionally expressive animation and agent runtime for the modern web. Inspired by the storytelling power of Flash and the programmable flexibility of modern frontend frameworks, ScreenWright allows designers, developers, and AI systems to create playable scenes with characters, props, emotion, and scripted behavior.

This framework supports multi-agent, timeline-driven storytelling powered by a lightweight physics and interaction engine — extensible via JSON, JSX, or LLM-driven scene generation.

## Core Principles

- 🎮 **PC + NPC Runtime Model**  
  One main player character (PC), with optional non-player characters (NPCs) and sub-variants.

- 💥 **Emotion and Action Based Animation**  
  Characters hold, throw, emote, morph, and act in ways that reflect cartoon logic and physicality.

- 🧠 **Scene as the Root Construct**  
Scenes contain actors, props, background/foreground elements, and time-based triggers.

- ⏱️ **Nested & Embedded Timelines**  
  Each scene and its elements maintain independent, nested timelines for granular, Flash-style animation sequences—leaves fall, birds fly, and sub-elements animate on their own timelines under a root timeline.

- 🪞 **Layered Parallax Rendering**  
Foreground, midground, and background layers all support actor/prop placement and scale.

- 🌐 **Physics & Shared Forces**  
  Elements can be influenced by global or local forces (gravity, wind, turbulence), enabling realistic or stylized motion via a common physics engine.

- 🧩 **Variants & Asset Flexibility**  
  Support for interchangeable assets (SVG, emoji, or rendered markup) and variants per element for A/B testing or dynamic content.

- 🧱 **Composable, Open Format**  
  The runtime reads scene instructions from declarative JSON or scriptable React APIs.

- 🔁 **Narrative Continuity Across Tabs or Pages**  
  Agents can throw across tabs, reappear on new domains, or continue scripted behavior.

- 💬 **Chatbot-Directed Scenes (Future)**  
  AI-driven scripting enables dynamic runtime scene generation based on user or system context.

## Use Cases

- Emotionally driven product banners  
- Agent-based onboarding or tutorials  
- Micro-scene storytelling (“good ideas vs bad ideas”)  
- Narrative play spaces across tabs or domains  
- Creative runtime for ideas like Brainchildren or FlashterFX

## Project Status

This repo is the foundation of the runtime. Current efforts focus on:

- Creating `SceneManager`
- Supporting runtime scene loading from JSON
- Implementing basic hold/throw/emote primitives
- Adding collision and prop impact triggers
- Enabling BAW overlays and expressive narrative effects
- Supporting tab-aware agent teleportation

- Designing nested and embedded timeline infrastructure
- Integrating parallax controls and shared physics forces
- Enabling asset variants and experiment support