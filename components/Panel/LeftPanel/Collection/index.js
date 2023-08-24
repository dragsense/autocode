
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/fetch";
import CollectionList from "./CollectionList";

export function CollectionComponent() {


    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [collections, setCollections] = useState([]);

    const laod = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            const id = localStorage.getItem("project");
            const response = await fetcher('/api/projects/' + id, {
                method: 'GET'
            });


            const  _collections = await fetcher(`http://${response.project.domain}:${response.project.port}/api/collections`, {
                method: 'Get',
                headers: { 'x-api-key': response.project.apikey  },
            });
            setCollections(_collections);
        } catch (e) {
            setError(e?.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect( () => {

        laod();

    }, []);

    return (
      
            <div className="h-100p">
                <CollectionList collections={collections} />
            </div>
        
    );
};


