import { App } from "antd";
import BookDetail from "components/client/book/book.detail";
import BookLoader from "components/client/book/book.loader";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailBookAPI } from "services/api";




const BookPage = () => {
    const { notification } = App.useApp()
    const [currentBook, setCurrentBook] = useState<IBookTable | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    let { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchDetailBook = async () => {
                setIsLoading(true)
                const res = await getDetailBookAPI(id);
                if (res && res.data) {
                    setCurrentBook(res.data)

                } else {
                    notification.error({
                        message: "Đã có lỗi xảy ra",
                        description: res.message
                    })
                }
                setIsLoading(false)
            }
            fetchDetailBook()
        }
    }, [id])

    return (
        <div>
            {isLoading ? <BookLoader /> :
                <BookDetail currentBook={currentBook} />}
        </div>
    );
};
export default BookPage;
