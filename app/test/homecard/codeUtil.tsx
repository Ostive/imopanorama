import { useState } from "react";
import { Ruler, Trees, Mountain, Sun, Waves } from "lucide-react"; // Vos icônes

export default function CreateLandProperty() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [superficie, setSuperficie] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [specialities, setSpecialities] = useState([]);

  // Options pour les spécificités
  const specialityOptions = [
    { icon: Ruler, label: "Superficie", value: "" },
    { icon: Trees, label: "Zonage", value: "" },
    { icon: Mountain, label: "Terrain", value: "" },
    { icon: Sun, label: "Exposition", value: "" },
    { icon: Waves, label: "Proximité de l'eau", value: "" },
  ];

  // Ajouter une spécificité
  const addSpeciality = (label, icon, value) => {
    setSpecialities([...specialities, { label, icon, value }]);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construire l'objet de terrain à partir des entrées
    const newLandProperty = {
      title,
      description,
      price,
      address,
      specificities: specialities,
      images: [], // Gestion des images plus tard
    };

    console.log("Terrain créé : ", newLandProperty);
    // Votre logique pour envoyer les données au backend
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <label>Titre</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-class"
          placeholder="Titre du terrain"
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea-class"
          placeholder="Description du terrain"
        />
      </div>

      <div>
        <label>Superficie</label>
        <input
          type="text"
          value={superficie}
          onChange={(e) => setSuperficie(e.target.value)}
          className="input-class"
          placeholder="Superficie (ex : 7500 m²)"
        />
      </div>

      <div>
        <label>Prix</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input-class"
          placeholder="Prix (ex : 180 000 €)"
        />
      </div>

      <div>
        <label>Adresse</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input-class"
          placeholder="Adresse du terrain"
        />
      </div>

      <div>
        <label>Spécificités</label>
        {specialityOptions.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <option.icon className="icon-class" />
            <span>{option.label}</span>
            <input
              type="text"
              placeholder="Valeur"
              onChange={(e) =>
                addSpeciality(option.label, option.icon, e.target.value)
              }
              className="input-class"
            />
          </div>
        ))}
      </div>

      <button type="submit" className="btn-class">
        Créer le terrain
      </button>
    </form>
  );
}
