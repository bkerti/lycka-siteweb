
const ModelOptions = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-semibold mb-6">Options et personnalisations</h2>
      <div className="bg-card p-6 rounded-lg shadow-md">
        <p className="text-muted-foreground mb-4">
          Ce modèle peut être personnalisé selon vos besoins et préférences. Voici quelques options disponibles :
        </p>
        <ul className="list-disc pl-5 mb-6 space-y-2">
          <li>Extension de la surface habitable</li>
          <li>Ajout d'une terrasse ou d'un balcon</li>
          <li>Modification des finitions intérieures</li>
          <li>Installation de systèmes domotiques</li>
          <li>Solutions d'énergie renouvelable</li>
        </ul>
        <p className="text-muted-foreground">
          Pour en savoir plus sur les options de personnalisation et obtenir un devis adapté à votre projet, n'hésitez pas à nous contacter.
        </p>
      </div>
    </div>
  );
};

export default ModelOptions;
