import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/api";

/**
 * Interface cho Flashcard Deck
 */
export interface FlashcardDeck {
  id: number;
  userId: string;
  name: string;
  description: string;
  totalCards: number;
  language?: string;
  category?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface cho Flashcard (từ vựng trong deck)
 * Sử dụng front/back theo API response thực tế
 */
export interface FlashcardWord {
  id: number;
  deckId: number;
  front: string;  // Từ vựng
  back: string;   // Nghĩa
  example?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Data để tạo deck mới
 */
export interface CreateDeckData {
  name: string;
  description: string;
}

/**
 * Response từ API tạo deck
 */
export interface CreateDeckResponse {
  success: boolean;
  data?: FlashcardDeck;
  message?: string;
}

/**
 * Response từ API lấy danh sách decks
 */
export interface GetDecksResponse {
  success: boolean;
  data?: FlashcardDeck[];
  message?: string;
}

/**
 * Response từ API lấy deck theo ID
 */
export interface GetDeckByIdResponse {
  success: boolean;
  data?: FlashcardDeck & { words?: FlashcardWord[] };
  message?: string;
}

/**
 * Interface cho dữ liệu tạo flashcard
 */
export interface CreateFlashcardData {
  front: string;
  back: string;
  example?: string;
  note?: string;
}

/**
 * Tạo flashcard deck mới
 */
export const createDeck = async (
  deckData: CreateDeckData
): Promise<CreateDeckResponse> => {
  try {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.CREATE_DECK,
      deckData
    );

    return {
      success: true,
      data: response.data,
      message: "Tạo deck thành công",
    };
  } catch (error: any) {
    console.error("Error creating deck:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi tạo deck");
  }
};

/**
 * Lấy danh sách tất cả flashcard decks
 */
export const getDecks = async (): Promise<GetDecksResponse> => {
  try {
    const response = await apiClient.get<any>("/flashcard/get-all-deck");

    // Xử lý nhiều format response khác nhau
    let decks: FlashcardDeck[] = [];
    
    if (Array.isArray(response.data)) {
      // API trả về mảng trực tiếp
      decks = response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      // API trả về { data: [...] }
      decks = response.data.data;
    } else if (response.data?.decks && Array.isArray(response.data.decks)) {
      // API trả về { decks: [...] }
      decks = response.data.decks;
    } else if (response.data && typeof response.data === "object") {
      // Nếu là object đơn, chuyển thành array
      decks = [response.data];
    }

    return {
      success: true,
      data: decks,
    };
  } catch (error: any) {
    console.error("Error fetching decks:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi lấy danh sách decks");
  }
};

/**
 * Lấy thông tin deck theo ID
 */
export const getDeckById = async (
  deckId: number
): Promise<GetDeckByIdResponse> => {
  try {
    const response = await apiClient.get<any>(
      `/flashcard/get-deck-byId/${deckId}`
    );

    // API trả về array
    if (Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data[0],
      };
    }

    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error: any) {
    console.error("Error fetching deck:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi lấy thông tin deck");
  }
};

/**
 * Cập nhật deck
 */
export const updateDeck = async (
  deckId: number,
  deckData: Partial<CreateDeckData>
): Promise<CreateDeckResponse> => {
  try {
    const response = await apiClient.patch<any>(
      `/flashcard/update-deck/${deckId}`,
      deckData
    );

    return {
      success: true,
      data: response.data,
      message: "Cập nhật deck thành công",
    };
  } catch (error: any) {
    console.error("Error updating deck:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi cập nhật deck");
  }
};

/**
 * Xóa deck
 */
export const deleteDeck = async (
  deckId: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    await apiClient.delete(`/flashcard/delete-deck/${deckId}`);

    return {
      success: true,
      message: "Xóa deck thành công",
    };
  } catch (error: any) {
    console.error("Error deleting deck:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi xóa deck");
  }
};

/**
 * Lấy danh sách card trong deck
 */
export const getCardsByDeckId = async (
  deckId: number
): Promise<{ success: boolean; data?: FlashcardWord[]; message?: string }> => {
  try {
    const response = await apiClient.get<any>(
      `/flashcard/${deckId}/get-all-card`
    );

    // Xử lý response theo format: { data: [ { flashcards: [...] } ] }
    if (
      response.data &&
      Array.isArray(response.data.data) &&
      response.data.data.length > 0
    ) {
      const deckData = response.data.data[0];
      if (deckData && Array.isArray(deckData.flashcards)) {
        return {
          success: true,
          data: deckData.flashcards,
          message: response.data.message,
        };
      }
    }

    return {
      success: true,
      data: [],
      message: "Chưa có flashcard nào",
    };
  } catch (error: any) {
    console.error("Error fetching cards:", error);
    return {
      success: true,
      data: [],
      message: error.message || "Có lỗi xảy ra khi lấy danh sách thẻ",
    };
  }
};

/**
 * Tạo flashcard mới
 */
export const createFlashcard = async (
  deckId: number,
  cardData: CreateFlashcardData
): Promise<{ success: boolean; data?: FlashcardWord; message?: string }> => {
  try {
    const response = await apiClient.post<any>(
      `/flashcard/${deckId}/create-flash-card`,
      cardData
    );

    return {
      success: true,
      data: response.data,
      message: "Tạo thẻ thành công",
    };
  } catch (error: any) {
    console.error("Error creating flashcard:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi tạo flashcard");
  }
};

/**
 * Tạo nhiều flashcard cùng lúc
 */
export const createFlashcardsBulk = async (
  deckId: number,
  cardsData: CreateFlashcardData[]
): Promise<{ success: boolean; message?: string; results?: any[] }> => {
  try {
    const promises = cardsData.map((card) => createFlashcard(deckId, card));
    const results = await Promise.all(promises);

    return {
      success: true,
      message: `Đã tạo ${results.length} flashcard thành công`,
      results,
    };
  } catch (error: any) {
    console.error("Error creating bulk flashcards:", error);
    throw new Error(
      error.message || "Có lỗi xảy ra khi tạo hàng loạt flashcard"
    );
  }
};

/**
 * Cập nhật flashcard
 */
export const updateFlashcard = async (
  cardId: number,
  cardData: CreateFlashcardData
): Promise<{ success: boolean; data?: FlashcardWord; message?: string }> => {
  try {
    const response = await apiClient.patch<any>(
      `/flashcard/update-card/${cardId}`,
      cardData
    );

    return {
      success: true,
      data: response.data,
      message: "Cập nhật thẻ thành công",
    };
  } catch (error: any) {
    console.error("Error updating flashcard:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi cập nhật flashcard");
  }
};

/**
 * Xóa flashcard
 */
export const deleteFlashcard = async (
  cardId: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log("🔄 Gửi request DELETE /flashcard/delete-card/" + cardId);
    const response = await apiClient.delete(`/flashcard/delete-card/${cardId}`);
    console.log("✅ Response DELETE:", response);

    return {
      success: true,
      message: "Xóa thẻ thành công",
    };
  } catch (error: any) {
    console.error("❌ Error deleting flashcard:", error);
    console.error("❌ Error response:", error.response);
    console.error("❌ Error status:", error.response?.status);
    console.error("❌ Error data:", error.response?.data);
    throw new Error(error.response?.data?.message || error.message || "Có lỗi xảy ra khi xóa flashcard");
  }
};
