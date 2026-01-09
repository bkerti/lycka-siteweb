
const LyckaHomeProcess = () => {
  return (
    <section className="section bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4">Comment ça fonctionne</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Le processus d'achat d'un modèle LYCKA HOME est simple et transparent. Voici les principales étapes :
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-lycka-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3">Choisissez votre modèle</h3>
            <p className="text-muted-foreground">
              Explorez notre catalogue, comparez les différents modèles et sélectionnez celui qui correspond le mieux à vos besoins et à votre budget.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-lycka-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3">Personnalisez votre maison</h3>
            <p className="text-muted-foreground">
              Adaptez le modèle à vos préférences : matériaux, finitions, aménagements intérieurs... Nos architectes vous accompagnent dans cette démarche.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-lycka-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">Concrétisez votre projet</h3>
            <p className="text-muted-foreground">
              Achetez votre modèle et recevez tous les plans nécessaires pour la construction. Nous pouvons également vous accompagner pour la réalisation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LyckaHomeProcess;
