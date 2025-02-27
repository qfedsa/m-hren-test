import React from 'react';

const FAQ: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Wie funktioniert die Marktanalyse?</h3>
        <p>
          Die Marktanalyse bietet eine Übersicht über verschiedene Regionen und deren
          Immobilienmärkte. Sie können Regionen auf der Karte auswählen, um detaillierte
          Informationen zu erhalten.
        </p>
      </div>
      <div>
        <h3 className="font-semibold">Was ist das Portfolio?</h3>
        <p>
          Im Portfolio können Sie Immobilien speichern, die Sie beobachten oder in die Sie
          investiert haben. Sie können den Status der Immobilien verwalten und Notizen
          hinzufügen.
        </p>
      </div>
      <div>
        <h3 className="font-semibold">Wie werden die Marktdaten berechnet?</h3>
        <p>
          Die Marktdaten basieren auf verschiedenen Quellen und Algorithmen. Sie werden
          regelmäßig aktualisiert, um die aktuellste Situation widerzuspiegeln.
        </p>
      </div>
      <div>
        <h3 className="font-semibold">Wie funktioniert die KI-Preisprognose?</h3>
        <p>
          Die KI-Preisprognose nutzt historische Daten und aktuelle Markttrends, um
          zukünftige Preisentwicklungen vorherzusagen. Beachten Sie, dass dies eine
          Prognose ist und keine Garantie für zukünftige Preise darstellt.
        </p>
      </div>
    </div>
  );
};

export default FAQ;
