
const LyckaHomeTestimonials = () => {
  return (
    <section className="section bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4">Ce que nos clients disent</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Découvrez les témoignages de nos clients satisfaits qui ont choisi LYCKA HOME pour leur projet de construction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <img
                  src="https://randomuser.me/api/portraits/women/65.jpg"
                  alt="Sophie Martin"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">Sophie Martin</h4>
                <p className="text-sm text-muted-foreground">Modèle Harmony</p>
              </div>
            </div>
            <p className="text-muted-foreground italic">
              "Nous sommes ravis de notre maison LYCKA HOME. Le processus a été fluide du début à la fin, et le résultat dépasse nos attentes. La qualité de la construction et l'attention aux détails sont remarquables."
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Pierre Dubois"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">Pierre Dubois</h4>
                <p className="text-sm text-muted-foreground">Modèle Serenity</p>
              </div>
            </div>
            <p className="text-muted-foreground italic">
              "L'équipe de LYCKA a été à l'écoute de nos besoins et a su adapter le modèle à nos exigences. Le résultat est une maison qui nous ressemble, à la fois belle et fonctionnelle."
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Marie Lefèvre"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">Marie Lefèvre</h4>
                <p className="text-sm text-muted-foreground">Modèle Pure</p>
              </div>
            </div>
            <p className="text-muted-foreground italic">
              "Ce que j'ai apprécié, c'est la transparence tout au long du processus. Les délais ont été respectés et le budget n'a pas dépassé ce qui était prévu. Je recommande vivement LYCKA HOME."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LyckaHomeTestimonials;
