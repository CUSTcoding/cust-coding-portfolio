import { memo } from "react";
import { texts } from "@/config/texts";
import { SkillTree } from "../skills/SkillTree";

function SkillsBase() {
  return (
    <section className="panel" id="skills" aria-label="Habilidades">
      <div className="container">
        <h2 className="anaglyph cyberpunk" id="skills-title">
          {texts.skills.title}
        </h2>
        <SkillTree />
      </div>
    </section>
  );
}

export const Skills = memo(SkillsBase);
